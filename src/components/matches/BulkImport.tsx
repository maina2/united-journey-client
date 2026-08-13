import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Papa from 'papaparse'
import { 
  Upload, 
  FileSpreadsheet, 
  Check, 
  X, 
  AlertCircle, 
  Loader2,
  Download,
  Trash2,
  ArrowRight
} from 'lucide-react'
import { useBulkImportMatches } from '../../hooks/useMatches'

interface BulkImportProps {
  onSuccess: () => void
  onCancel: () => void
}

interface ImportRow {
  match_date: string
  opponent: string
  competition: string
  venue: string
  attendance_type: 'in_person' | 'watched'
  is_home: string | boolean
  score_home: string | number
  score_away: string | number
  notes: string
  [key: string]: string | number | boolean | undefined
}

interface PreviewRow extends ImportRow {
  _index: number
  _errors: string[]
  _valid: boolean
}

export const BulkImport = ({ onSuccess, onCancel }: BulkImportProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<PreviewRow[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<{
    created: number
    failed: number
    errors: Array<{ index: number; error: string }>
  } | null>(null)
  
  const bulkImport = useBulkImportMatches()

  const requiredFields = [
    'match_date',
    'opponent',
    'competition',
    'venue',
    'attendance_type',
  ]

  const downloadTemplate = () => {
    const headers = [
      'match_date',
      'opponent',
      'competition',
      'venue',
      'attendance_type',
      'is_home',
      'score_home',
      'score_away',
      'notes'
    ]
    
    const exampleRow = [
      '2026-08-22T12:30:00Z',
      'Hull City',
      'Premier League',
      'Old Trafford',
      'in_person',
      'true',
      '2',
      '0',
      'Great win!'
    ]
    
    const csvContent = [
      headers.join(','),
      exampleRow.join(',')
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'match_import_template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const validateRow = (row: ImportRow, index: number): PreviewRow => {
    const errors: string[] = []
    
    // Check required fields
    requiredFields.forEach(field => {
      if (!row[field] || String(row[field]).trim() === '') {
        errors.push(`Missing required field: ${field}`)
      }
    })
    
    // Validate date format
    if (row.match_date) {
      const date = new Date(row.match_date)
      if (isNaN(date.getTime())) {
        errors.push('Invalid date format. Use ISO format (YYYY-MM-DDTHH:mm:ssZ)')
      }
    }
    
    // Validate attendance_type
    if (row.attendance_type && !['in_person', 'watched'].includes(String(row.attendance_type).toLowerCase())) {
      errors.push('attendance_type must be "in_person" or "watched"')
    }
    
    // Validate is_home
    if (row.is_home !== undefined && row.is_home !== '') {
      const homeStr = String(row.is_home).toLowerCase()
      if (!['true', 'false', '1', '0'].includes(homeStr)) {
        errors.push('is_home must be true/false or 1/0')
      }
    }
    
    // Validate scores are numbers
    if (row.score_home && isNaN(Number(row.score_home))) {
      errors.push('score_home must be a number')
    }
    if (row.score_away && isNaN(Number(row.score_away))) {
      errors.push('score_away must be a number')
    }
    
    return {
      ...row,
      _index: index,
      _errors: errors,
      _valid: errors.length === 0
    }
  }

  const handleFileDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return
    
    setFile(file)
    setIsProcessing(true)
    setImportResult(null)
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as ImportRow[]
        const validated = rows.map((row, index) => validateRow(row, index + 2))
        setPreviewData(validated)
        setIsProcessing(false)
      },
      error: (error) => {
        console.error('CSV parsing error:', error)
        setIsProcessing(false)
      }
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  })

  const handleImport = async () => {
    if (previewData.length === 0) return
    
    const validRows = previewData.filter(row => row._valid)
    if (validRows.length === 0) {
      alert('No valid rows to import. Please fix the errors.')
      return
    }
    
    setIsImporting(true)
    
    const matches = validRows.map(row => {
      const match: any = {
        match_date: row.match_date,
        opponent: String(row.opponent).trim(),
        competition: String(row.competition).trim(),
        venue: String(row.venue).trim(),
        attendance_type: String(row.attendance_type).toLowerCase() as 'in_person' | 'watched',
        is_home: ['true', '1'].includes(String(row.is_home).toLowerCase()),
      }
      
      if (row.score_home && !isNaN(Number(row.score_home))) {
        match.score_home = Number(row.score_home)
      }
      if (row.score_away && !isNaN(Number(row.score_away))) {
        match.score_away = Number(row.score_away)
      }
      if (row.notes) {
        match.notes = String(row.notes).trim()
      }
      
      return match
    })
    
    try {
      const result = await bulkImport.mutateAsync(matches)
      setImportResult({
        created: result.created,
        failed: result.failed,
        errors: result.errors || []
      })
      
      if (result.created > 0) {
        setTimeout(() => {
          onSuccess()
        }, 2000)
      }
    } catch (error) {
      console.error('Import failed:', error)
      alert('Import failed. Please try again.')
    } finally {
      setIsImporting(false)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setPreviewData([])
    setImportResult(null)
  }

  const validCount = previewData.filter(row => row._valid).length
  const invalidCount = previewData.length - validCount

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-united-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-united-gray-200 bg-united-gray-50">
          <h2 className="text-xl font-bold text-united-black flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-united-red" />
            Bulk Import Matches
          </h2>
          <p className="text-sm text-united-gray-500 mt-1">
            Upload a CSV file to import multiple matches at once
          </p>
        </div>

        <div className="p-6">
          {/* Template Download */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-united-black">Don't have a CSV?</p>
              <p className="text-xs text-united-gray-500">Download our template to get started</p>
            </div>
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center gap-2 text-united-red hover:text-united-red-dark font-medium text-sm"
            >
              <Download className="w-4 h-4" />
              Download Template
            </button>
          </div>

          {/* File Upload Area */}
          {!file && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                isDragActive
                  ? 'border-united-red bg-united-red/5'
                  : 'border-united-gray-300 hover:border-united-red/50 hover:bg-united-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-united-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-united-black">
                {isDragActive ? 'Drop your CSV here' : 'Drag & drop your CSV file here'}
              </p>
              <p className="text-sm text-united-gray-500 mt-1">
                or click to browse files
              </p>
              <p className="text-xs text-united-gray-400 mt-4">
                Supports CSV files up to 5MB
              </p>
            </div>
          )}

          {/* File Preview */}
          {file && (
            <div className="bg-united-gray-50 rounded-xl p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-8 h-8 text-united-red" />
                <div>
                  <p className="font-medium text-united-black">{file.name}</p>
                  <p className="text-xs text-united-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="p-2 hover:bg-united-gray-200 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 text-united-gray-500" />
              </button>
            </div>
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-united-red mx-auto" />
              <p className="text-sm text-united-gray-500 mt-2">Processing your file...</p>
            </div>
          )}

          {/* Preview Table */}
          {!isProcessing && previewData.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h3 className="font-semibold text-united-black">Preview</h3>
                  <span className="text-sm text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                    {validCount} valid
                  </span>
                  {invalidCount > 0 && (
                    <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded-md">
                      {invalidCount} errors
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRemoveFile}
                    className="text-sm text-united-gray-500 hover:text-united-red transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={validCount === 0 || isImporting}
                    className="bg-united-red text-united-white px-4 py-2 rounded-lg font-semibold hover:bg-united-red-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isImporting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        Import {validCount} Matches
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-united-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-united-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-united-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-united-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-united-gray-500 uppercase tracking-wider">Opponent</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-united-gray-500 uppercase tracking-wider">Competition</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-united-gray-500 uppercase tracking-wider">Venue</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-united-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-united-gray-100">
                    {previewData.slice(0, 10).map((row) => (
                      <tr key={row._index} className={row._valid ? 'hover:bg-united-gray-50' : 'bg-red-50/50'}>
                        <td className="px-4 py-3 text-xs text-united-gray-500">{row._index}</td>
                        <td className="px-4 py-3 text-xs text-united-black">{row.match_date || '-'}</td>
                        <td className="px-4 py-3 text-xs text-united-black">{row.opponent || '-'}</td>
                        <td className="px-4 py-3 text-xs text-united-black">{row.competition || '-'}</td>
                        <td className="px-4 py-3 text-xs text-united-black">{row.venue || '-'}</td>
                        <td className="px-4 py-3 text-xs">
                          {row._valid ? (
                            <span className="text-emerald-600 flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Valid
                            </span>
                          ) : (
                            <span className="text-red-600 flex items-center gap-1" title={row._errors.join(', ')}>
                              <AlertCircle className="w-3 h-3" />
                              {row._errors.length} error{row._errors.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {previewData.length > 10 && (
                  <div className="px-4 py-3 bg-united-gray-50 text-center text-xs text-united-gray-500">
                    Showing first 10 of {previewData.length} rows
                  </div>
                )}
              </div>

              {/* Error Summary */}
              {invalidCount > 0 && (
                <div className="mt-4 bg-red-50 rounded-xl p-4 border border-red-200">
                  <h4 className="text-sm font-semibold text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {invalidCount} row{invalidCount > 1 ? 's' : ''} have errors
                  </h4>
                  <p className="text-xs text-red-600 mt-1">
                    Fix the errors and re-upload, or continue with valid rows only.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Import Result */}
          {importResult && (
            <div className={`mt-6 rounded-xl p-4 border ${
              importResult.failed === 0 
                ? 'bg-emerald-50 border-emerald-200' 
                : 'bg-amber-50 border-amber-200'
            }`}>
              <div className="flex items-center gap-3">
                {importResult.failed === 0 ? (
                  <Check className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                )}
                <div>
                  <p className="font-semibold text-united-black">
                    Import Complete
                  </p>
                  <p className="text-sm">
                    <span className="text-emerald-600 font-medium">{importResult.created}</span> matches imported
                    {importResult.failed > 0 && (
                      <span className="text-amber-600 font-medium">, {importResult.failed} failed</span>
                    )}
                  </p>
                </div>
              </div>
              {importResult.errors.length > 0 && (
                <div className="mt-3 max-h-32 overflow-y-auto">
                  {importResult.errors.map((error, idx) => (
                    <p key={idx} className="text-xs text-red-600">
                      Row {error.index}: {error.error}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
