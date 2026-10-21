import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Trash2,
  CheckCircle2,
  FolderPlus,
  ChevronDown
} from 'lucide-react';
import { ExtendedPortfolioProject, compressImageDataUrl } from '../utils/portfolioStore';
import { RichTextEditor } from './RichTextEditor';

interface AddPortfolioModalProps {
  onClose: () => void;
  onSave: (newProject: ExtendedPortfolioProject) => void;
}

export const AddPortfolioModal: React.FC<AddPortfolioModalProps> = ({
  onClose,
  onSave
}) => {
  // Form Field States for New Project
  const [displayName, setDisplayName] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [geographicLocation, setGeographicLocation] = useState<string>('');
  const [sectorSegment, setSectorSegment] = useState<string>('Commercial Construction');
  const [projectStatus, setProjectStatus] = useState<string>('Ongoing');

  // Media Queue Grid State - empty by default for new project
  const [mediaQueue, setMediaQueue] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [richTextContent, setRichTextContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const [imageUrlInput, setImageUrlInput] = useState<string>('');

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFiles = (files: File[]) => {
    const fileList = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (fileList.length === 0) return;

    const readers: Promise<string>[] = fileList.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
          if (event.target?.result) {
            const dataUrl = event.target.result as string;
            const compressed = await compressImageDataUrl(dataUrl);
            resolve(compressed);
          } else {
            resolve('');
          }
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((newImages) => {
      const validImages = newImages.filter(Boolean);
      if (validImages.length === 0) return;
      setMediaQueue((prev) => [...prev, ...validImages]);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const handleAddUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    setMediaQueue((prev) => [...prev, trimmed]);
    setImageUrlInput('');
  };

  const handleRemoveMedia = (indexToRemove: number) => {
    setMediaQueue((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Rich Text Formatting Toolbar Helper
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = richTextContent.substring(start, end);
    const replacement = `${prefix}${selectedText || 'Sample Text'}${suffix}`;

    const newContent =
      richTextContent.substring(0, start) +
      replacement +
      richTextContent.substring(end);

    setRichTextContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText.length || 11)
      );
    }, 50);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || isSubmitting) return;

    setIsSubmitting(true);

    const fallbackImg = 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?auto=format&fit=crop&w=1200&q=80';
    const mainImg = mediaQueue.length > 0 ? mediaQueue[0] : fallbackImg;
    const projId = `PRJ-${Math.floor(100 + Math.random() * 900)}`;

    const newProject: ExtendedPortfolioProject = {
      id: projId,
      assetYear: `ID: #${projId} | Est. ${new Date().getFullYear()}`,
      title: displayName.trim(),
      client: clientName.trim() || 'Private Client',
      location: geographicLocation.trim() || 'Metro Manila, PH',
      category: sectorSegment,
      designatedCategory: `${displayName.trim()} | ${sectorSegment}`,
      clientLocation: `${clientName.trim() || 'Private Client'} • ${geographicLocation.trim() || 'Metro Manila'}`,
      status: projectStatus,
      year: `${new Date().getFullYear()}`,
      area: '45,000 sq ft',
      imageUrl: mainImg,
      galleryImages: mediaQueue.length > 0 ? mediaQueue : [mainImg],
      description: (() => {
        const plain = richTextContent.replace(/<[^>]*>/g, ' ').replace(/[#*`|_]/g, '').replace(/\s+/g, ' ').trim();
        return plain.length > 180 ? plain.substring(0, 180) + '...' : plain;
      })(),
      detailedScope: richTextContent,
      highlights: ['Turnkey Certificate of Occupancy', 'Zero Cal/OSHA Safety Incidents'],
      liveUrl: 'https://zekedevelopment.com'
    };

    onSave(newProject);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Main Modal Container Card */}
      <div className="relative w-full max-w-4xl bg-white text-[#1E293B] shadow-2xl rounded-xl border border-zinc-300 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        
        {/* ==================== A. MODAL HEADER BAR ==================== */}
        <div className="bg-[#111111] text-white px-5 sm:px-6 py-4 border-b-2 border-[#003399] flex items-center justify-between shrink-0 sticky top-0 z-20">
          {/* Left Group */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#003399] text-white flex items-center justify-center font-bold shadow-sm shrink-0">
              <FolderPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display font-black text-base sm:text-lg text-white uppercase tracking-tight leading-none">
                POST PORTFOLIO PROJECT
              </h2>
            </div>
          </div>

          {/* Right Group: Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Close Post Project Modal"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ==================== B. MODAL FORM BODY ==================== */}
        <form id="add-portfolio-form" onSubmit={handlePublish} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-white">
          
          {/* SECTION 1: PORTFOLIO DATA 2-COLUMN INPUT GRID */}
            <div className="space-y-5">
              <div className="flex items-center gap-2.5">
                <h3 className="font-display font-black text-sm text-[#111111] uppercase tracking-wider">
                  1. PORTFOLIO DATA &amp; ASSET METADATA
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {/* Row 1 - Field 1: PROJECT DISPLAY NAME * */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider">
                    PROJECT DISPLAY NAME <span className="text-[#FF5500]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Proposed 3-Storey Residence"
                    className="w-full p-3 bg-white border border-[#D1D5DB] rounded-lg text-xs sm:text-sm text-[#111111] font-sans font-semibold placeholder:text-zinc-400 focus:outline-none focus:border-[#003399] focus:ring-1 focus:ring-[#003399] transition-all"
                  />
                </div>

                {/* Row 1 - Field 2: CLIENT NAME * */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider">
                    CLIENT NAME <span className="text-[#FF5500]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Mr. & Mrs. Carvajal"
                    className="w-full p-3 bg-white border border-[#D1D5DB] rounded-lg text-xs sm:text-sm text-[#111111] font-sans font-semibold placeholder:text-zinc-400 focus:outline-none focus:border-[#003399] focus:ring-1 focus:ring-[#003399] transition-all"
                  />
                </div>

                {/* Row 2 - Field 3: GEOGRAPHIC LOCATION * */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider">
                    GEOGRAPHIC LOCATION <span className="text-[#FF5500]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={geographicLocation}
                    onChange={(e) => setGeographicLocation(e.target.value)}
                    placeholder="e.g. GMA, Cavite"
                    className="w-full p-3 bg-white border border-[#D1D5DB] rounded-lg text-xs sm:text-sm text-[#111111] font-sans font-semibold placeholder:text-zinc-400 focus:outline-none focus:border-[#003399] focus:ring-1 focus:ring-[#003399] transition-all"
                  />
                </div>

                {/* Row 2 - Field 4: SECTOR / SEGMENT (ASSET SEGMENT) * */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider">
                    SECTOR / SEGMENT (ASSET SEGMENT) <span className="text-[#FF5500]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={sectorSegment}
                      onChange={(e) => setSectorSegment(e.target.value)}
                      className="w-full appearance-none pl-3 pr-9 py-3 bg-white border border-[#D1D5DB] rounded-lg text-xs sm:text-sm text-[#111111] font-sans font-semibold focus:outline-none focus:border-[#003399] focus:ring-1 focus:ring-[#003399] cursor-pointer transition-all"
                    >
                      <option value="Residential Construction">Residential Construction</option>
                      <option value="Commercial Construction">Commercial Construction</option>
                      <option value="Renovation & Retrofitting">Renovation & Retrofitting</option>
                      <option value="Interior Fit-Out">Interior Fit-Out</option>
                      <option value="Waterproofing">Waterproofing</option>
                      <option value="Gate & Fence Construction">Gate & Fence Construction</option>
                      <option value="Additions & Extensions">Additions & Extensions</option>
                      <option value="Land Development">Land Development</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Row 3 - Field 5: PROJECT STATUS * */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider">
                    PROJECT STATUS <span className="text-[#FF5500]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={projectStatus}
                      onChange={(e) => setProjectStatus(e.target.value)}
                      className="w-full appearance-none pl-3 pr-9 py-3 bg-white border border-[#D1D5DB] rounded-lg text-xs sm:text-sm text-[#111111] font-sans font-semibold focus:outline-none focus:border-[#003399] focus:ring-1 focus:ring-[#003399] cursor-pointer transition-all"
                    >
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: ASSET MEDIA GALLERY UPLOAD & ACTIVE QUEUE */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-display font-black text-sm text-[#111111] uppercase tracking-wider">
                    2. ASSET MEDIA GALLERY &amp; ACTIVE QUEUE
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-[#FF5500] font-bold uppercase tracking-wider">
                  {mediaQueue.length} {mediaQueue.length === 1 ? 'FILE' : 'FILES'} IN QUEUE
                </span>
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                accept="image/*"
                className="hidden"
              />

              {/* Dropzone Container */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
                  isDragging
                    ? 'border-[#003399] bg-blue-50/50 shadow-inner scale-[0.99]'
                    : 'border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#003399] hover:bg-zinc-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center mb-2 transition-colors ${
                  isDragging ? 'bg-[#003399] text-white border-blue-900' : 'bg-white border-[#E5E7EB] text-[#003399] shadow-2xs'
                }`}>
                  <Upload className="w-5 h-5 stroke-[2]" />
                </div>
                
                <p className="font-display font-black text-xs sm:text-sm text-[#111111] uppercase tracking-wider mb-1">
                  DRAG &amp; DROP MULTIPLE MEDIA FILES HERE
                </p>
                <p className="font-mono text-[11px] text-[#64748B] font-semibold uppercase tracking-wider">
                  OR CLICK TO BROWSE LOCAL FILESYSTEM
                </p>
              </div>

              {/* Active Media Queue Grid */}
              <div className="space-y-3">
                {mediaQueue.length === 0 ? (
                  <div className="p-5 text-center font-mono text-xs text-[#94A3B8] border border-dashed border-[#CBD5E1] rounded-lg bg-[#F8FAFC]">
                    No active images in gallery. Upload photos above to display thumbnail cards.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5 pt-1 pb-2 w-full">
                    {mediaQueue.map((imgUrl, index) => (
                      <div
                        key={index}
                        className="relative aspect-square w-full rounded-lg border border-[#E5E7EB] overflow-hidden group bg-zinc-900 shadow-2xs"
                      >
                        <img
                          src={imgUrl}
                          alt={`Gallery upload ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Main Image Badge indicator */}
                        {index === 0 && (
                          <span className="absolute top-1 left-1 bg-[#003399] text-white font-mono font-bold text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded shadow-sm z-10">
                            COVER
                          </span>
                        )}

                        {/* Hover Overlay with Delete Media button */}
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 z-10">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveMedia(index);
                            }}
                            className="p-2 bg-[#FF5500] hover:bg-[#E04B00] text-white rounded-full transition-transform active:scale-95 shadow-md cursor-pointer flex items-center justify-center"
                            title="Delete Media from Queue"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                          <span className="font-mono text-[9px] text-white font-bold uppercase tracking-wider mt-1.5">
                            DELETE MEDIA
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 3: PROJECT SCOPE & DETAILS (RICH TEXT EDITOR) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-display font-black text-sm text-[#111111] uppercase tracking-wider">
                    3. PROJECT SCOPE &amp; DETAILS (RICH TEXT EDITOR) <span className="text-[#FF5500]">*</span>
                  </h3>
                </div>
              </div>

              {/* Rich Text Editor Component */}
              <RichTextEditor
                value={richTextContent}
                onChange={setRichTextContent}
                placeholder="Enter detailed scope narrative, materials breakdown, and architectural parameters..."
              />
            </div>
        </form>

        {/* ==================== C. MODAL FOOTER ACTION BAR ==================== */}
        <div className="bg-[#F8FAFC] border-t border-[#E5E7EB] p-4 sm:p-5 flex items-center justify-between sm:justify-end gap-3 shrink-0 sticky bottom-0 z-20">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-[#CBD5E1] bg-white text-[#111111] hover:bg-zinc-100 font-display font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-2xs"
          >
            CANCEL
          </button>

          <button
            type="submit"
            form="add-portfolio-form"
            className="px-6 py-2.5 rounded-lg bg-[#003399] hover:bg-[#FF5500] text-white font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>PUBLISH NEW PROJECT</span>
          </button>
        </div>

      </div>
    </div>
  );
};
