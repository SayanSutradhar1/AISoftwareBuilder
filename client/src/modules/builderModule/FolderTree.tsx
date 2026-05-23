import { useState } from 'react';
import { Folder, FolderOpen, ChevronRight, ChevronDown, FileJson, FileText, FileCode, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FileNode {
  path: string;
  type: 'file' | 'folder';
  description?: string;
}

interface TreeNode {
  name: string;
  type: 'file' | 'folder';
  fullPath: string;
  description?: string;
  children: { [key: string]: TreeNode };
}

function buildTree(nodes: FileNode[]): TreeNode {
  const root: TreeNode = { name: 'root', type: 'folder', fullPath: '', children: {} };

  nodes.forEach((node) => {
    const parts = node.path.split('/').filter(Boolean);
    let current = root;

    parts.forEach((part, index) => {
      const currentPath = parts.slice(0, index + 1).join('/');
      if (!currentPath) return;

      if (!current.children[part]) {
        const isLast = index === parts.length - 1;
        current.children[part] = {
          name: part,
          type: isLast ? node.type : 'folder',
          fullPath: isLast ? node.path : currentPath,
          description: isLast ? node.description : undefined,
          children: {},
        };
      }
      current = current.children[part];
    });
  });

  return root;
}

const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'ts':
    case 'tsx':
      return <FileCode className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
    case 'js':
    case 'jsx':
      return <FileCode className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
    case 'json':
      return <FileJson className="w-3.5 h-3.5 text-yellow-500 shrink-0" />;
    case 'md':
      return <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    default:
      return <FileCode className="w-3.5 h-3.5 text-indigo-400 shrink-0" />;
  }
};

interface TreeItemProps {
  node: TreeNode;
  depth?: number;
  generatedFiles?: string[];
  onSelectFile?: (path: string) => void;
  selectedFile?: string | null;
}

const TreeItem = ({ node, depth = 0, generatedFiles = [], onSelectFile, selectedFile }: TreeItemProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const isFolder = node.type === 'folder' || Object.keys(node.children).length > 0;
  const isGenerated = generatedFiles.includes(node.fullPath);
  const isSelected = selectedFile === node.fullPath;

  return (
    <div className="select-none font-mono">
      {/* File/Folder Row Container */}
      <div
        className={`flex items-start py-2 px-2.5 rounded-xl cursor-pointer group transition-all relative ${
          isSelected 
            ? 'bg-indigo-500/10 text-white border-l-2 border-indigo-500' 
            : 'hover:bg-white/[0.03] text-gray-300 hover:text-white'
        }`}
        style={{ paddingLeft: `${depth * 1.25 + 0.75}rem` }}
        onClick={() => {
          if (isFolder) {
            setIsOpen(!isOpen);
          } else if (onSelectFile) {
            onSelectFile(node.fullPath);
          }
        }}
      >
        {/* Toggle Folder Chevron */}
        <span className="mr-1.5 mt-0.5 text-gray-500 flex-shrink-0 group-hover:text-gray-300 transition-colors">
          {isFolder ? (
            isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <span className="w-3.5 h-3.5 inline-block" />
          )}
        </span>

        {/* Primary Type Icon */}
        <span className="mr-2 mt-0.5 flex-shrink-0">
          {isFolder ? (
            isOpen ? (
              <FolderOpen className="w-4 h-4 text-amber-400/90 shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-amber-500/90 shrink-0" />
            )
          ) : (
            getFileIcon(node.name)
          )}
        </span>

        <div className="flex flex-col flex-1 min-w-0">
          <span className={`text-xs flex items-center gap-1.5 truncate ${
            isFolder ? 'font-semibold tracking-wide text-gray-200' : isSelected ? 'text-white' : isGenerated ? 'text-emerald-400' : 'text-gray-300'
          }`}>
            {node.name}
            {!isFolder && isGenerated && (
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-emerald-500/20 text-emerald-400"
              >
                <Check className="w-2.5 h-2.5" />
              </motion.span>
            )}
          </span>
          
          {/* File/Folder description pop-up hint on hover */}
          {node.description && (
            <span className="text-[10px] text-gray-500 font-light mt-1 hidden group-hover:block transition-all max-w-[240px] leading-relaxed border-t border-white/5 pt-1">
              {node.description}
            </span>
          )}
        </div>
      </div>
      
      {/* Directory Nesting Container */}
      <AnimatePresence>
        {isFolder && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden relative"
          >
            {/* Elegant vertical directory line rail guides */}
            <div 
              className="absolute top-0 bottom-0 border-l border-white/5" 
              style={{ left: `${depth * 1.25 + 1.2}rem` }} 
            />

            {Object.values(node.children)
              .sort((a, b) => {
                const aIsFolder = a.type === 'folder' || Object.keys(a.children).length > 0;
                const bIsFolder = b.type === 'folder' || Object.keys(b.children).length > 0;
                if (aIsFolder && !bIsFolder) return -1;
                if (!aIsFolder && bIsFolder) return 1;
                return a.name.localeCompare(b.name);
              })
              .map((child) => (
                <TreeItem 
                  key={child.name} 
                  node={child} 
                  depth={depth + 1} 
                  generatedFiles={generatedFiles}
                  onSelectFile={onSelectFile}
                  selectedFile={selectedFile}
                />
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FolderTree({ 
  structure, 
  generatedFiles = [], 
  onSelectFile,
  selectedFile 
}: { 
  structure: FileNode[];
  generatedFiles?: string[];
  onSelectFile?: (path: string) => void;
  selectedFile?: string | null;
}) {
  if (!structure || structure.length === 0) return null;
  const tree = buildTree(structure);

  return (
    <div className="bg-[#0b0b10]/95 dark:bg-black/60 rounded-[2rem] border border-white/10 p-5 overflow-hidden shadow-2xl backdrop-blur-2xl">
      {/* Tree Explorer Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          {/* OS Style color bullets */}
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          </div>
          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest ml-2 font-mono">
            Scaffolding Explorer
          </span>
        </div>
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
          Ready
        </span>
      </div>
      
      {/* Interactive Node List */}
      <div className="max-h-[550px] overflow-y-auto custom-scrollbar pr-1.5 space-y-0.5">
        {Object.values(tree.children).map((child) => (
          <TreeItem 
            key={child.name} 
            node={child} 
            depth={0} 
            generatedFiles={generatedFiles}
            onSelectFile={onSelectFile}
            selectedFile={selectedFile}
          />
        ))}
      </div>
    </div>
  );
}
