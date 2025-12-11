import { useState, useRef } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

interface TemplateUploadFormProps {
  onSubmit: (data: { name: string; format: 'docx' | 'html'; file: File }) => void;
  isLoading?: boolean;
  error?: string;
}

export const TemplateUploadForm = ({ onSubmit, isLoading, error }: TemplateUploadFormProps) => {
  const [name, setName] = useState('');
  const [format, setFormat] = useState<'docx' | 'html'>('docx');
  const [file, setFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setLocalError('');
      
      // Auto-detect format from file extension
      const extension = selectedFile.name.toLowerCase().split('.').pop();
      if (extension === 'docx') {
        setFormat('docx');
      } else if (extension === 'html' || extension === 'htm') {
        setFormat('html');
      }
      
      // Auto-fill name if not set
      if (!name) {
        const nameWithoutExtension = selectedFile.name.replace(/\.[^/.]+$/, '');
        setName(nameWithoutExtension);
      }
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!file || !name.trim()) {
      setLocalError('Please select a file and enter a name');
      return;
    }

    onSubmit({
      name: name.trim(),
      format,
      file,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(error || localError) && <ErrorMessage message={error || localError} />}
      
      <div>
        <label htmlFor="template-name" className="block text-sm font-medium text-gray-700">
          Template Name *
        </label>
        <input
          type="text"
          id="template-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input mt-1"
          placeholder="Enter template name"
          required
        />
      </div>

      <div>
        <label htmlFor="template-format" className="block text-sm font-medium text-gray-700">
          Format *
        </label>
        <select
          id="template-format"
          value={format}
          onChange={(e) => setFormat(e.target.value as 'docx' | 'html')}
          className="input mt-1"
          required
        >
          <option value="docx">DOCX</option>
          <option value="html">HTML</option>
        </select>
      </div>

      <div>
        <label htmlFor="template-file" className="block text-sm font-medium text-gray-700">
          File *
        </label>
        <input
          ref={fileInputRef}
          type="file"
          id="template-file"
          accept=".docx,.html,.htm"
          onChange={handleFileSelect}
          className="input mt-1"
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          Supported formats: DOCX, HTML (Max 10MB)
        </p>
      </div>

      {file && (
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium text-gray-900">Selected file:</p>
          <p className="text-sm text-gray-700">{file.name}</p>
          <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => {
            setName('');
            setFormat('docx');
            setFile(null);
            setLocalError('');
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
          className="btn btn-secondary"
          disabled={isLoading}
        >
          Reset
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
          Upload Template
        </button>
      </div>
    </form>
  );
};
