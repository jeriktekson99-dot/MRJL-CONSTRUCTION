import React, { useState, useRef, useEffect } from 'react';
import {
  Type,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link as LinkIcon,
  Table as TableIcon,
  RemoveFormatting,
  X,
  Check,
  Minus,
  Plus
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Cleans HTML to strip unwanted framework attributes (like Angular ngcontent, inline-copy-host, aria-*, class, style noise)
 * and cleans up any leaked attribute strings from clipboard pasting.
 */
export function cleanHtml(raw: string): string {
  if (!raw) return '';

  let cleaned = raw;

  // 1. Remove leaked attribute strings that might appear in raw text
  cleaned = cleaned.replace(/(?:ngcontent-[a-z0-9_-]*|inline-copy-host)\s*=\s*(?:"[^"]*"|'[^']*'|""|'')/gi, '');
  cleaned = cleaned.replace(/\b(?:aria-busy|aria-live|aria-[a-z-]+|dir)="[^"]*"/gi, '');
  cleaned = cleaned.replace(/style="[^"]*?(?:--animation|appearance:|border-color:|animation:|hyphens:|line-height:\s*1\.15\s*!important)[^"]*"/gi, '');

  // 2. DOM-based cleaning if running in browser
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(cleaned, 'text/html');

      const sanitizeNode = (node: Node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          const tagName = el.tagName.toLowerCase();

          // Unwrap non-standard framework tags (e.g. custom angular/web component tags)
          if (tagName.includes('-') && !['font-awesome'].some(k => tagName.includes(k))) {
            const parent = el.parentNode;
            if (parent) {
              while (el.firstChild) {
                parent.insertBefore(el.firstChild, el);
              }
              parent.removeChild(el);
              return;
            }
          }

          // Strip noisy attributes
          const attrs = Array.from(el.attributes);
          for (const attr of attrs) {
            const attrName = attr.name.toLowerCase();

            if (tagName === 'a' && (attrName === 'href' || attrName === 'target' || attrName === 'rel')) {
              continue;
            }

            if (attrName === 'style') {
              const allowedStyles: string[] = [];
              const fontSz = el.style.fontSize;
              if (fontSz) allowedStyles.push(`font-size: ${fontSz}`);
              const fontWt = el.style.fontWeight;
              if (fontWt) allowedStyles.push(`font-weight: ${fontWt}`);
              const fontSt = el.style.fontStyle;
              if (fontSt) allowedStyles.push(`font-style: ${fontSt}`);
              const txtDec = el.style.textDecoration;
              if (txtDec) allowedStyles.push(`text-decoration: ${txtDec}`);
              const col = el.style.color;
              if (col && !col.includes('rgb(31, 31, 31)')) allowedStyles.push(`color: ${col}`);

              if (allowedStyles.length > 0) {
                el.setAttribute('style', allowedStyles.join('; '));
              } else {
                el.removeAttribute('style');
              }
              continue;
            }

            if (
              attrName.startsWith('ng') ||
              attrName.startsWith('aria-') ||
              attrName.startsWith('data-') ||
              attrName === 'inline-copy-host' ||
              attrName === 'class' ||
              attrName === 'id' ||
              attrName === 'dir'
            ) {
              el.removeAttribute(attr.name);
            }
          }

          Array.from(el.childNodes).forEach(sanitizeNode);
        } else if (node.nodeType === Node.TEXT_NODE) {
          if (node.nodeValue) {
            let val = node.nodeValue;
            if (val.includes('ngcontent') || val.includes('inline-copy-host') || val.includes('animation: auto ease')) {
              val = val.replace(/(?:ngcontent-[a-z0-9_-]*|inline-copy-host|aria-busy|aria-live|enable-luminous)[\s\S]*?(?:">|>|$)/gi, '');
              node.nodeValue = val;
            }
          }
        }
      };

      Array.from(doc.body.childNodes).forEach(sanitizeNode);
      cleaned = doc.body.innerHTML;
    } catch {
      // Fallback
    }
  }

  // Final cleanup for remaining attribute fragments
  cleaned = cleaned.replace(/ngcontent-[a-z0-9_-]*=""/gi, '');
  cleaned = cleaned.replace(/inline-copy-host=""/gi, '');
  cleaned = cleaned.replace(/(?:class|id|aria-busy|aria-live|dir)="[^"]*"/gi, '');
  cleaned = cleaned.replace(/style="[^"]*--animation-duration[^"]*"/gi, '');
  cleaned = cleaned.replace(/^\s*">/, '');

  return cleaned;
}

/**
 * Converts raw Markdown or plain text into clean HTML for visual rendering.
 */
export function markdownToHtml(md: string): string {
  if (!md) return '';

  let html = cleanHtml(md);

  // Render markdown tables if any
  if (html.includes('|')) {
    const lines = html.split('\n');
    const resultLines: string[] = [];
    let inTable = false;
    let tableRows: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('|') && line.endsWith('|')) {
        if (line.includes(':---') || line.includes('---')) {
          continue;
        }
        inTable = true;
        tableRows.push(line);
      } else {
        if (inTable) {
          resultLines.push(renderTableHtml(tableRows));
          tableRows = [];
          inTable = false;
        }
        resultLines.push(line);
      }
    }
    if (inTable && tableRows.length > 0) {
      resultLines.push(renderTableHtml(tableRows));
    }
    html = resultLines.join('\n');
  }

  // Convert markdown syntax to HTML tags
  html = html.replace(/^(?:<p>)?### (.*?)(?:<\/p>)?$/gim, '<h3>$1</h3>');
  html = html.replace(/^(?:<p>)?## (.*?)(?:<\/p>)?$/gim, '<h2>$1</h2>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // If input was already HTML formatted, return the processed HTML
  if (/<[a-z][\s\S]*>/i.test(md)) {
    return html;
  }

  // Otherwise, handle list item lines and paragraph wrapping for plain text markdown
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*?<\/li>\s*)+/gs, (match) => `<ul>${match}</ul>`);

  const paras = html.split('\n\n');
  return paras
    .map(p => {
      const trimmed = p.trim();
      if (!trimmed) return '';
      if (/^<(h2|h3|ul|ol|table|div|p)/i.test(trimmed)) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('');
}

function renderTableHtml(rows: string[]): string {
  if (rows.length === 0) return '';
  const parseRow = (r: string) => r.split('|').slice(1, -1).map(c => c.trim());
  const header = parseRow(rows[0]);
  const body = rows.slice(1).map(parseRow);

  const headerHtml = header.map(h => `<th style="border:1px solid #CBD5E1; padding:8px; background:#F1F5F9; font-weight:bold; text-align:left;">${h}</th>`).join('');
  const bodyHtml = body.map(row => {
    const cols = row.map(c => `<td style="border:1px solid #CBD5E1; padding:8px;">${c}</td>`).join('');
    return `<tr>${cols}</tr>`;
  }).join('');

  return `<table style="width:100%; border-collapse:collapse; margin:12px 0; border:1px solid #CBD5E1; font-size:13px;"><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Type detailed scope, specifications, or narrative here...'
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Formatting active states
  const [activeStates, setActiveStates] = useState({
    bold: false,
    italic: false,
    underline: false,
    ul: false,
    ol: false,
  });

  // Custom Font Size state
  const [customFontSize, setCustomFontSize] = useState<string>('14');

  // Table Popover Widget state
  const [showTablePopover, setShowTablePopover] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  // Link Popover Widget state
  const [showLinkPopover, setShowLinkPopover] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('https://');

  // Synchronize incoming initial value to contenteditable
  useEffect(() => {
    if (editorRef.current) {
      const currentHtml = editorRef.current.innerHTML;
      const formattedInitial = markdownToHtml(value);
      if (currentHtml !== formattedInitial && currentHtml !== value) {
        editorRef.current.innerHTML = formattedInitial || value;
      }
    }
  }, [value]);

  // Save current text selection range inside editor
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = range.cloneRange();
        return;
      }
    }
    savedRangeRef.current = null;
  };

  // Restore saved text selection range
  const restoreSelection = () => {
    if (editorRef.current) {
      editorRef.current.focus();
      if (savedRangeRef.current) {
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(savedRangeRef.current);
        }
      }
    }
  };

  // Update active state of formatting commands on selection change
  const updateActiveStates = () => {
    if (!editorRef.current) return;
    try {
      const isBold = document.queryCommandState('bold');
      const isItalic = document.queryCommandState('italic');
      const isUnderline = document.queryCommandState('underline');
      const isUl = document.queryCommandState('insertUnorderedList');
      const isOl = document.queryCommandState('insertOrderedList');

      setActiveStates({
        bold: isBold,
        italic: isItalic,
        underline: isUnderline,
        ul: isUl,
        ol: isOl,
      });
    } catch {
      // Ignore errors if selection outside editor
    }
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && editorRef.current) {
        const range = sel.getRangeAt(0);
        if (editorRef.current.contains(range.commonAncestorContainer)) {
          savedRangeRef.current = range.cloneRange();
        }
      }
      if (document.activeElement === editorRef.current || editorRef.current?.contains(document.activeElement)) {
        updateActiveStates();
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  const syncContent = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      const cleaned = cleanHtml(html);
      if (cleaned !== html) {
        editorRef.current.innerHTML = cleaned;
      }
      onChange(cleaned);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const htmlData = e.clipboardData.getData('text/html');
    const textData = e.clipboardData.getData('text/plain');

    if (htmlData) {
      const cleaned = cleanHtml(htmlData);
      document.execCommand('insertHTML', false, cleaned);
    } else if (textData) {
      const cleanedText = cleanHtml(textData);
      document.execCommand('insertText', false, cleanedText);
    }

    syncContent();
    updateActiveStates();
  };

  const focusEditor = () => {
    if (editorRef.current && document.activeElement !== editorRef.current && !editorRef.current.contains(document.activeElement)) {
      editorRef.current.focus();
    }
  };

  // Command executor helper with active state refresh
  const execCmd = (command: string, arg?: string) => {
    focusEditor();
    document.execCommand(command, false, arg);
    syncContent();
    updateActiveStates();
  };

  // Apply custom inline font size (in px)
  const handleApplyFontSize = (sizeVal: number | string) => {
    const size = typeof sizeVal === 'number' ? sizeVal : parseInt(sizeVal, 10);
    if (!size || isNaN(size) || size < 6 || size > 200) return;

    saveSelection();
    restoreSelection();

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    if (sel.isCollapsed && savedRangeRef.current) {
      const range = savedRangeRef.current;
      const span = document.createElement('span');
      span.style.fontSize = `${size}px`;
      const textNode = document.createTextNode('\u200B');
      span.appendChild(textNode);
      range.insertNode(span);

      const newRange = document.createRange();
      newRange.setStart(textNode, 1);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
    } else {
      document.execCommand('fontSize', false, '7');
      if (editorRef.current) {
        const fontNodes = editorRef.current.querySelectorAll('font[size="7"], font[size]');
        fontNodes.forEach((node) => {
          const span = document.createElement('span');
          span.style.fontSize = `${size}px`;
          span.innerHTML = node.innerHTML;
          node.parentNode?.replaceChild(span, node);
        });
      }
    }

    syncContent();
    updateActiveStates();
  };

  // Step Font Size by delta (+1 / -1)
  const handleStepFontSize = (delta: number) => {
    const current = parseInt(customFontSize, 10) || 14;
    const next = Math.max(8, Math.min(120, current + delta));
    setCustomFontSize(String(next));
    handleApplyFontSize(next);
  };

  // Open Link Widget
  const handleOpenLinkWidget = () => {
    saveSelection();
    let selectedText = '';
    if (savedRangeRef.current) {
      selectedText = savedRangeRef.current.toString();
    }
    setLinkText(selectedText);
    setLinkUrl('https://');
    setShowTablePopover(false);
    setShowLinkPopover((prev) => !prev);
  };

  // Confirm Link Insertion
  const handleConfirmInsertLink = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!linkUrl || linkUrl.trim() === '' || linkUrl.trim() === 'https://') return;

    restoreSelection();

    let finalUrl = linkUrl.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    const selText = savedRangeRef.current ? savedRangeRef.current.toString() : '';

    if (selText && selText.length > 0) {
      // Selected/highlighted text -> make link
      document.execCommand('createLink', false, finalUrl);
    } else {
      // Unselected -> insert display text as link
      const textToDisplay = linkText.trim() || finalUrl;
      const linkHtml = `<a href="${finalUrl}" target="_blank" rel="noopener noreferrer" style="color: #003399; text-decoration: underline; font-weight: 600;">${textToDisplay}</a>&nbsp;`;
      document.execCommand('insertHTML', false, linkHtml);
    }

    syncContent();
    updateActiveStates();
    setShowLinkPopover(false);
  };

  // Open Table Widget
  const handleOpenTableWidget = () => {
    saveSelection();
    setShowLinkPopover(false);
    setShowTablePopover((prev) => !prev);
  };

  // Create empty editable table with up to 5 rows and 5 columns max
  const handleConfirmInsertTable = () => {
    restoreSelection();
    const validRows = Math.min(Math.max(1, tableRows), 5);
    const validCols = Math.min(Math.max(1, tableCols), 5);

    let tableHtml = `<table style="width:100%; border-collapse:collapse; margin:12px 0; border:1px solid #CBD5E1; font-size:13px;"><thead><tr style="background:#F1F5F9;">`;

    for (let c = 1; c <= validCols; c++) {
      tableHtml += `<th style="border:1px solid #CBD5E1; padding:8px; font-weight:bold; text-align:left;">Header ${c}</th>`;
    }
    tableHtml += `</tr></thead><tbody>`;

    for (let r = 1; r <= validRows; r++) {
      tableHtml += `<tr>`;
      for (let c = 1; c <= validCols; c++) {
        tableHtml += `<td style="border:1px solid #CBD5E1; padding:8px;">Row ${r}, Col ${c}</td>`;
      }
      tableHtml += `</tr>`;
    }
    tableHtml += `</tbody></table><p><br/></p>`;

    document.execCommand('insertHTML', false, tableHtml);
    syncContent();
    setShowTablePopover(false);
  };

  return (
    <div className={`relative border rounded-xl transition-all shadow-2xs ${
      isFocused ? 'border-[#003399] ring-1 ring-[#003399]' : 'border-[#D1D5DB]'
    }`}>
      {/* Editor Toolbar Header */}
      <div className="bg-[#111111] text-white p-2 sm:p-2.5 border-b border-zinc-800 flex items-center justify-between gap-2 select-none rounded-t-xl relative z-20">
        {/* Toolbar formatting controls */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
          {/* Custom Font Size Stepper Control (FIRST OPTION) */}
          <div className="flex items-center gap-1 bg-[#222222] border border-zinc-700/80 rounded-lg px-1.5 py-1 text-xs text-zinc-200">
            <Type className="w-3.5 h-3.5 text-zinc-400 shrink-0 ml-0.5 mr-0.5" />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleStepFontSize(-1)}
              className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors cursor-pointer flex items-center justify-center"
              title="Decrease font size"
            >
              <Minus className="w-3 h-3" />
            </button>
            <input
              type="number"
              min={8}
              max={120}
              value={customFontSize}
              onChange={(e) => {
                const val = e.target.value;
                setCustomFontSize(val);
                if (val && !isNaN(Number(val))) {
                  handleApplyFontSize(Number(val));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                  if (customFontSize) {
                    handleApplyFontSize(customFontSize);
                  }
                }
              }}
              className="w-10 bg-[#161616] border border-zinc-700 rounded px-1 py-0.5 text-center text-white text-xs font-mono font-bold focus:outline-none focus:border-[#C8102E]"
              title="Custom font size in px"
            />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleStepFontSize(1)}
              className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors cursor-pointer flex items-center justify-center"
              title="Increase font size"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="w-px h-5 bg-zinc-800 mx-0.5 sm:mx-1" />

          {/* Bold */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => execCmd('bold')}
            className={`p-1.5 rounded transition-all cursor-pointer ${
              activeStates.bold
                ? 'bg-[#003399] text-white shadow-xs font-bold'
                : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
            }`}
            title="Bold (Ctrl+B)"
          >
            <BoldIcon className="w-4 h-4" />
          </button>

          {/* Italic */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => execCmd('italic')}
            className={`p-1.5 rounded transition-all cursor-pointer ${
              activeStates.italic
                ? 'bg-[#003399] text-white shadow-xs font-bold'
                : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
            }`}
            title="Italic (Ctrl+I)"
          >
            <ItalicIcon className="w-4 h-4" />
          </button>

          {/* Underline */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => execCmd('underline')}
            className={`p-1.5 rounded transition-all cursor-pointer ${
              activeStates.underline
                ? 'bg-[#003399] text-white shadow-xs font-bold'
                : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
            }`}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-zinc-800 mx-1" />

          {/* Bullet List */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => execCmd('insertUnorderedList')}
            className={`p-1.5 rounded transition-all cursor-pointer ${
              activeStates.ul
                ? 'bg-[#003399] text-white shadow-xs'
                : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
            }`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>

          {/* Numbered List */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => execCmd('insertOrderedList')}
            className={`p-1.5 rounded transition-all cursor-pointer ${
              activeStates.ol
                ? 'bg-[#003399] text-white shadow-xs'
                : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
            }`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-zinc-800 mx-1" />

          {/* Link Button & Floating Popover Widget */}
          <div className="relative inline-block">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleOpenLinkWidget}
              className={`p-1.5 rounded transition-all cursor-pointer ${
                showLinkPopover
                  ? 'bg-[#003399] text-white shadow-xs'
                  : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
              }`}
              title="Insert Link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>

            {/* FLOATING LINK POPOVER WIDGET */}
            {showLinkPopover && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full left-0 mt-2 z-50 bg-[#161616] text-white rounded-xl p-4 w-72 border border-zinc-800 shadow-2xl space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <div className="flex items-center gap-1.5 text-[#FF5500]">
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span className="font-mono font-bold text-xs uppercase tracking-wider text-white">
                      INSERT HYPERLINK
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowLinkPopover(false)}
                    className="text-zinc-400 hover:text-white p-0.5 rounded cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  {/* Display Text input (if no text was highlighted) */}
                  {!savedRangeRef.current?.toString() && (
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">
                        Display Text:
                      </label>
                      <input
                        type="text"
                        value={linkText}
                        onChange={(e) => setLinkText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            e.stopPropagation();
                            handleConfirmInsertLink(e);
                          }
                        }}
                        placeholder="e.g. MRJL Construction"
                        className="w-full bg-[#222222] border border-zinc-700/80 rounded-lg px-2.5 py-1.5 text-zinc-100 font-sans text-xs focus:outline-none focus:border-[#003399]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">
                      Destination URL:
                    </label>
                    <input
                      type="text"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          e.stopPropagation();
                          handleConfirmInsertLink(e);
                        }
                      }}
                      placeholder="https://example.com"
                      autoFocus
                      className="w-full bg-[#222222] border border-zinc-700/80 rounded-lg px-2.5 py-1.5 text-zinc-100 font-mono text-xs focus:outline-none focus:border-[#003399]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowLinkPopover(false)}
                    className="flex-1 py-1.5 border border-zinc-700 rounded-lg font-mono text-[11px] font-bold text-zinc-300 hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmInsertLink}
                    className="flex-1 py-1.5 bg-[#003399] hover:bg-[#FF5500] text-white rounded-lg font-mono text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    APPLY
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Table Button & Floating Popover Widget */}
          <div className="relative inline-block">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleOpenTableWidget}
              className={`p-1.5 rounded transition-all cursor-pointer flex items-center gap-1 text-xs font-mono font-bold ${
                showTablePopover
                  ? 'bg-[#003399] text-white shadow-xs'
                  : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
              }`}
              title="Insert Custom Table (Max 5x5)"
            >
              <TableIcon className="w-4 h-4" />
              <span className="hidden sm:inline">TABLE</span>
            </button>

            {/* FLOATING TABLE POPOVER WIDGET */}
            {showTablePopover && (
              <div className="absolute top-full left-0 mt-2 z-50 bg-[#161616] text-white rounded-xl p-4 w-60 border border-zinc-800 shadow-2xl space-y-3">
                <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800">
                  <div className="flex items-center gap-1.5 text-[#FF5500]">
                    <TableIcon className="w-3.5 h-3.5" />
                    <span className="font-mono font-bold text-xs uppercase tracking-wider text-white">
                      INSERT TABLE (MAX 5x5)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowTablePopover(false)}
                    className="text-zinc-400 hover:text-white p-0.5 rounded cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2.5 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-zinc-300">Cols:</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={tableCols}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) setTableCols(Math.min(Math.max(1, val), 5));
                      }}
                      className="w-16 bg-[#222222] border border-zinc-700/80 rounded-lg px-2 py-1 text-center font-mono font-bold text-amber-300 text-sm focus:outline-none focus:border-[#003399]"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="font-bold text-zinc-300">Rows:</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={tableRows}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) setTableRows(Math.min(Math.max(1, val), 5));
                      }}
                      className="w-16 bg-[#222222] border border-zinc-700/80 rounded-lg px-2 py-1 text-center font-mono font-bold text-amber-300 text-sm focus:outline-none focus:border-[#003399]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmInsertTable}
                  className="w-full py-2 px-3 bg-[#003399] hover:bg-[#FF5500] text-white rounded-lg font-mono text-xs font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                >
                  <Check className="w-3.5 h-3.5" />
                  INSERT TABLE
                </button>
              </div>
            )}
          </div>

          {/* Clear Formatting */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => execCmd('removeFormat')}
            className="p-1.5 hover:bg-zinc-800 rounded text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Clear Formatting"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Body Area */}
      <div
        ref={editorRef}
        contentEditable
        onPaste={handlePaste}
        onInput={() => {
          syncContent();
          updateActiveStates();
        }}
        onKeyUp={updateActiveStates}
        onMouseUp={updateActiveStates}
        onFocus={() => {
          setIsFocused(true);
          updateActiveStates();
        }}
        onBlur={() => {
          setIsFocused(false);
          syncContent();
        }}
        className="rich-text-editor-content min-h-[280px] max-h-[500px] p-5 sm:p-6 bg-white text-zinc-900 font-sans text-sm leading-relaxed outline-none overflow-y-auto rounded-b-xl"
        style={{ wordBreak: 'break-word' }}
      />
    </div>
  );
};
