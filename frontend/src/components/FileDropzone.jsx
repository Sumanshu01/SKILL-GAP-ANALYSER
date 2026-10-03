import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, FileText, CheckCircle2, Trash2 } from 'lucide-react'

export default function FileDropzone({
  file,
  onFileSelect,
  onFileRemove,
  label = 'Upload PDF Document',
  hint = 'Supports PDF format up to 10MB',
  disabled = false,
  accept = { 'application/pdf': ['.pdf'] },
}) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0])
      }
    },
    [onFileSelect]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled,
  })

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
  }

  if (file) {
    return (
      <div className="rounded-xl border border-primary-200 bg-primary-50/40 p-4 transition-all flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-slate-800 truncate">
                {file.name}
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>
            <p className="text-xs text-slate-500">
              {formatFileSize(file.size)} • PDF Ready for parsing
            </p>
          </div>
        </div>

        {!disabled && (
          <button
            type="button"
            onClick={onFileRemove}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-2 shrink-0"
            title="Remove document"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
        isDragActive
          ? 'border-primary-500 bg-primary-50/50 scale-[0.99]'
          : isDragReject
          ? 'border-danger-400 bg-danger-50/50'
          : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50/70 bg-white'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 mb-3 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
          <UploadCloud className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-slate-800 mb-0.5">
          {label}
        </p>
        <p className="text-xs text-slate-500 mb-2">
          {hint}
        </p>
        <span className="inline-flex items-center text-xs font-medium text-primary-600 hover:text-primary-700">
          Browse files from computer
        </span>
      </div>
    </div>
  )
}
