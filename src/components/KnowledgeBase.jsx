import React, { useState, useEffect } from 'react';
import { fetchDocuments, uploadDocument, deleteDocument } from '../api';

const KnowledgeBase = ({ isDark, onClose }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filename, setFilename] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' | 'error'

  const loadDocuments = async () => {
    setLoading(true);
    const docs = await fetchDocuments();
    if (Array.isArray(docs)) {
      setDocuments(docs);
    } else {
      setDocuments([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!filename.trim() || !content.trim()) {
      setMessage({ text: 'Please fill in both the title and text content.', type: 'error' });
      return;
    }

    setUploading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await uploadDocument(filename.trim(), content.trim());
      if (response.error) {
        setMessage({ text: response.error, type: 'error' });
      } else {
        setMessage({ text: response.message || 'Ingestion completed successfully!', type: 'success' });
        setFilename('');
        setContent('');
        loadDocuments();
      }
    } catch (err) {
      setMessage({ text: 'An error occurred during ingestion.', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (file) => {
    if (!window.confirm(`Are you sure you want to remove "${file}" from your knowledge base?`)) return;

    try {
      const response = await deleteDocument(file);
      if (response.error) {
        setMessage({ text: response.error, type: 'error' });
      } else {
        setMessage({ text: `Successfully deleted "${file}".`, type: 'success' });
        loadDocuments();
      }
    } catch (err) {
      setMessage({ text: 'An error occurred while deleting.', type: 'error' });
    }
  };

  const D = isDark;
  const cardBg = D ? 'bg-[#13132b]/80 border-violet-500/20' : 'bg-white border-slate-200';
  const textCls = D ? 'text-slate-100' : 'text-slate-800';
  const secondaryText = D ? 'text-slate-400' : 'text-slate-500';
  const inputBg = D ? 'bg-white/5 border-white/10 text-white focus:border-violet-500/50' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-violet-500';
  const tableHeader = D ? 'border-white/5 text-slate-400' : 'border-slate-100 text-slate-500';
  const hoverRow = D ? 'hover:bg-white/5 border-white/5' : 'hover:bg-slate-50 border-slate-100';

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-4 sm:p-6 rounded-2xl glass border" style={{ borderColor: D ? 'rgba(139, 92, 246, 0.2)' : 'rgba(226, 232, 240, 1)' }}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              RAG Knowledge Base Manager
            </h2>
            <p className="text-xs text-slate-400">Index articles, codebase docs, or FAQs to supercharge your AI's reasoning.</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Message Notifications */}
      {message.text && (
        <div className={`p-4 rounded-xl text-sm border flex items-start gap-3 animate-fade-in ${
          message.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          <div className="shrink-0 mt-0.5">
            {message.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <span className="font-medium leading-relaxed">{message.text}</span>
        </div>
      )}

      {/* Main Grid split */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Left Side: Upload Form (2 cols) */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <h3 className={`text-sm font-semibold uppercase tracking-wider ${secondaryText}`}>Add Document</h3>
          
          <form onSubmit={handleUpload} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">Document Title</label>
              <input
                type="text"
                placeholder="e.g. system-manual.txt"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-1 focus:ring-violet-500/50 ${inputBg}`}
                disabled={uploading}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">Text Content</label>
              <textarea
                placeholder="Paste code segments, technical details, API documentation, or structural guidelines here..."
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-sm resize-y transition-all focus:outline-none focus:ring-1 focus:ring-violet-500/50 ${inputBg}`}
                disabled={uploading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:scale-[0.98] transition-all shadow-md shadow-violet-500/20 disabled:opacity-50 disabled:pointer-events-none`}
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Embedding Document...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Index & Ingest
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Documents List (3 cols) */}
        <div className="md:col-span-3 flex flex-col gap-4">
          <h3 className={`text-sm font-semibold uppercase tracking-wider ${secondaryText}`}>Active Source Materials</h3>
          
          <div className={`flex-1 min-h-[250px] max-h-[420px] overflow-y-auto rounded-xl border border-white/5 bg-[#0a0a18]/40 overflow-hidden`}>
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full py-16 gap-3">
                <div className="w-8 h-8 border-3 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
                <span className="text-xs text-slate-500">Checking indexed content...</span>
              </div>
            ) : documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center px-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v4.5" />
                </svg>
                <h4 className="text-sm font-bold text-slate-300">No documents indexed yet</h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1">Upload files, past FAQs, or code bases to feed context to your RAG chatbot pipeline.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className={`border-b ${tableHeader} uppercase tracking-wider font-semibold`}>
                      <th className="px-4 py-3">Document Title</th>
                      <th className="px-4 py-3 text-center">Vectors</th>
                      <th className="px-4 py-3 text-right">Added On</th>
                      <th className="px-4 py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {documents.map((doc) => (
                      <tr key={doc.filename} className={`transition-all duration-150 border-b ${hoverRow}`}>
                        <td className="px-4 py-3 font-semibold text-slate-200 truncate max-w-[150px]" title={doc.filename}>
                          {doc.filename}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold bg-violet-500/10 text-violet-300 border border-violet-500/20">
                            {doc.chunkCount} chunks
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-400">
                          {new Date(doc.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDelete(doc.filename)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/10 hover:border-rose-500/30 transition-all active:scale-95"
                            title="Delete file"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
