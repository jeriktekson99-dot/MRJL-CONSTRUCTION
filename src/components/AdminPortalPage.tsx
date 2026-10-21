import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Lock,
  User,
  UserPlus,
  ShieldAlert,
  CheckCircle2,
  Building2,
  FileText,
  Users,
  Search,
  Plus,
  ArrowRight,
  TrendingUp,
  HardHat,
  Filter,
  Download,
  Trash2,
  Edit,
  Eye,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  LogOut,
  AlertCircle,
  KeyRound,
  RefreshCw,
  LayoutDashboard,
  FolderKanban,
  Settings,
  Bell,
  Calendar,
  Globe,
  Archive,
  BarChart2,
  Check,
  ExternalLink,
  Menu,
  Clock,
  Sparkles,
  Layers,
  Pencil,
  RotateCcw,
  XCircle,
  ArrowLeft,
  MapPin,
  Paperclip,
  ShieldCheck,
  Image,
  Zap,
  Mail,
  Phone,
  Wrench,
  SlidersHorizontal,
  CheckSquare,
  Square,
  EyeOff,
  Share2,
  Database
} from 'lucide-react';
import { PORTFOLIO_PROJECTS, ADMIN_LOGIN_IMAGE } from '../data/siteData';
import { PortfolioProject } from '../types';
import { EditPortfolioModal, PortfolioEditingProject } from './EditPortfolioModal';
import { AddPortfolioModal } from './AddPortfolioModal';
import { AdminPortfolioDetailsView, AdminPortfolioItem } from './AdminPortfolioDetailsView';
import { usePortfolioStore, ExtendedPortfolioProject, TrashItem } from '../utils/portfolioStore';
import { useSocialLinks, getAdminPassword, saveAdminPassword } from '../utils/settingsStore';
import { isSupabaseConfigured, changePasswordInSupabase, updateSocialLinksInSupabase, signInWithSocialProvider, signInWithSupabasePassword, requestPasswordResetInSupabase } from '../lib/supabase';

interface AdminPortalPageProps {
  onNavigateHome: (sectionId?: string) => void;
  onNavigatePage: (page: 'privacy' | 'terms' | 'safety' | 'home' | 'about' | 'services' | 'portfolio' | 'admin') => void;
}

/* Reusable Icon-only Dispatch Button Component with Dark Tooltip */
const ActionIconButton: React.FC<{
  icon: React.ReactNode;
  tooltip: string;
  onClick: (e: React.MouseEvent) => void;
  variant?: 'default' | 'danger' | 'success' | 'amber' | 'blue';
}> = ({ icon, tooltip, onClick, variant = 'default' }) => {
  const variantClasses = {
    default: 'bg-white border-[#E5E7EB] text-[#64748B] hover:text-[#111111] hover:bg-[#F8FAFC] hover:border-[#CBD5E1]',
    danger: 'bg-white border-[#E5E7EB] text-[#64748B] hover:text-[#C8102E] hover:bg-red-50 hover:border-red-200',
    success: 'bg-white border-[#E5E7EB] text-[#64748B] hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200',
    amber: 'bg-white border-[#E5E7EB] text-[#64748B] hover:text-amber-600 hover:bg-amber-50 hover:border-amber-200',
    blue: 'bg-white border-[#E5E7EB] text-[#64748B] hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200',
  };

  return (
    <div className="relative group/tooltip inline-block">
      <button
        type="button"
        onClick={onClick}
        className={`w-8 h-8 rounded-lg border shadow-2xs transition-all duration-150 cursor-pointer flex items-center justify-center ${variantClasses[variant]}`}
      >
        {icon}
      </button>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:flex flex-col items-center pointer-events-none z-50">
        <div className="bg-[#111111] text-white text-[10px] font-mono py-1 px-2.5 rounded shadow-xl whitespace-nowrap uppercase tracking-wider font-bold">
          {tooltip}
        </div>
        <div className="w-2 h-2 bg-[#111111] rotate-45 -mt-1" />
      </div>
    </div>
  );
};


export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({ onNavigateHome, onNavigatePage }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('zeke_admin_authenticated') === 'true';
  });
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'forgot'>('login');
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [forgotSuccess, setForgotSuccess] = useState<boolean>(false);

  // Admin Dashboard State
  const [activeTab, setActiveTab] = useState<'portfolio' | 'trash' | 'settings'>('portfolio');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [notificationsList, setNotificationsList] = useState<{
    id: string;
    category: 'PORTFOLIO' | 'SAFETY' | 'SYSTEM';
    title: string;
    subtext: string;
    time: string;
    type: 'danger' | 'info' | 'success' | 'amber';
  }[]>([
    {
      id: 'notif-102',
      category: 'PORTFOLIO',
      title: 'Project Status Updated',
      subtext: 'Subic Container Berth transitioned to Under Construction.',
      time: '45 mins ago',
      type: 'info'
    },
    {
      id: 'notif-103',
      category: 'SAFETY',
      title: 'Safety Inspection Verified',
      subtext: '100% Cal/OSHA seismic compliance clearance issued.',
      time: '2 hrs ago',
      type: 'success'
    }
  ]);

  // Legacy Leads placeholders to satisfy disabled block types
  type LeadInquiry = any;
  const inspectingLead: any = null;
  const setInspectingLead: any = () => {};
  const getLeadStatusBadge: any = () => '';
  const handleSingleDeleteLead: any = () => {};
  const leadsList: any[] = [];
  const setLeadsList: any = () => {};
  const leadsSearch: any = '';
  const setLeadsSearch: any = () => {};
  const leadsStatusFilter: any = 'All';
  const setLeadsStatusFilter: any = () => {};
  const selectedLeadIds: any[] = [];
  const setSelectedLeadIds: any = () => {};
  const handleBulkDeleteLeads: any = () => {};
  const leadsPage: any = 1;
  const setLeadsPage: any = () => {};
  const leadsPerPage: any = 10;
  const setLeadsPerPage: any = () => {};

  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationsOpen]);

  const handleDismissAllNotifications = () => {
    setNotificationsList([]);
  };

  const handleDismissSingleNotification = (id: string) => {
    setNotificationsList(prev => prev.filter(n => n.id !== id));
  };
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. PORTFOLIO MANAGER & TRASH STORE
  const {
    projects: portfolioList,
    trash: vaultList,
    setProjects: setPortfolioList,
    setTrash: setVaultList
  } = usePortfolioStore();

  const [selectedPortfolioIds, setSelectedPortfolioIds] = useState<string[]>([]);
  const [portfolioSearch, setPortfolioSearch] = useState<string>('');
  const [portfolioStatusFilter, setPortfolioStatusFilter] = useState<string>('All');
  const [portfolioCategoryFilter, setPortfolioCategoryFilter] = useState<string>('All');
  const [portfolioPage, setPortfolioPage] = useState<number>(1);
  const [portfolioPerPage, setPortfolioPerPage] = useState<number>(10);
  const [inspectingProject, setInspectingProject] = useState<ExtendedPortfolioProject | null>(null);
  const [editingProject, setEditingProject] = useState<ExtendedPortfolioProject | null>(null);
  const [showAddProjectModal, setShowAddProjectModal] = useState<boolean>(false);
  const [newProjectTitle, setNewProjectTitle] = useState<string>('');
  const [newProjectCategory, setNewProjectCategory] = useState<'Commercial' | 'Residential' | 'Industrial' | 'Infrastructure'>('Commercial');
  const [newProjectLocation, setNewProjectLocation] = useState<string>('');
  const [newProjectBudget, setNewProjectBudget] = useState<string>('');

  // 3. ARCHIVE / TRASH VAULT STATE
  const [selectedVaultIds, setSelectedVaultIds] = useState<string[]>([]);
  const [vaultSearch, setVaultSearch] = useState<string>('');
  const [vaultPage, setVaultPage] = useState<number>(1);
  const [vaultPerPage, setVaultPerPage] = useState<number>(10);

  // 5. SYSTEM SETTINGS STATE & HANDLERS
  const { socialLinks, updateSocialLinks } = useSocialLinks();

  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [facebookUrl, setFacebookUrl] = useState<string>(socialLinks.facebookUrl);
  const [instagramUrl, setInstagramUrl] = useState<string>(socialLinks.instagramUrl);
  const [tiktokUrl, setTiktokUrl] = useState<string>(socialLinks.tiktokUrl);

  useEffect(() => {
    setFacebookUrl(socialLinks.facebookUrl);
    setInstagramUrl(socialLinks.instagramUrl);
    setTiktokUrl(socialLinks.tiktokUrl);
  }, [socialLinks]);

  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    show: false,
    message: '',
    type: 'success',
  });

  const triggerToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3500);
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const activePassword = getAdminPassword();

    if (!oldPassword.trim()) {
      triggerToast('Please retype your old password.', 'error');
      return;
    }
    if (oldPassword !== activePassword) {
      triggerToast('Incorrect old password. Please retype your current active password.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      triggerToast('New password must be at least 6 characters long.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      triggerToast('New password and confirm password do not match.', 'error');
      return;
    }

    saveAdminPassword(newPassword);

    if (isSupabaseConfigured()) {
      const res = await changePasswordInSupabase(newPassword);
      if (res.success) {
        triggerToast('Password updated in Supabase Auth & Local Store successfully!', 'success');
      } else {
        triggerToast(`Local password updated. Supabase notice: ${res.message}`, 'info');
      }
    } else {
      triggerToast('Password updated successfully in local storage!', 'success');
    }

    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValidUrl = (url: string) => {
      if (!url.trim()) return true;
      try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch {
        return false;
      }
    };

    if (!isValidUrl(facebookUrl) || !isValidUrl(instagramUrl) || !isValidUrl(tiktokUrl)) {
      triggerToast('Please enter valid URLs (starting with http:// or https://)', 'error');
      return;
    }

    const socialData = {
      facebookUrl: facebookUrl.trim(),
      instagramUrl: instagramUrl.trim(),
      tiktokUrl: tiktokUrl.trim()
    };

    updateSocialLinks(socialData);

    if (isSupabaseConfigured()) {
      await updateSocialLinksInSupabase(socialData);
      triggerToast('Social links synced to Supabase site_settings table successfully!', 'success');
    } else {
      triggerToast('Social media links saved successfully across the site!', 'success');
    }
  };


  // Handle Login Submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    const activePassword = getAdminPassword();

    if (isSupabaseConfigured()) {
      try {
        const res = await signInWithSupabasePassword(username, password);
        if (res.success) {
          localStorage.setItem('zeke_admin_authenticated', 'true');
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // Check if local custom password matches as fallback
        if (activePassword && password.trim() === activePassword) {
          localStorage.setItem('zeke_admin_authenticated', 'true');
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        setAuthError(res.message || 'Invalid credentials. User authentication failed in Supabase.');
        setIsLoading(false);
      } catch (err: any) {
        setAuthError(err?.message || 'Authentication error.');
        setIsLoading(false);
      }
    } else {
      setTimeout(() => {
        if (username.trim() && activePassword && password.trim() === activePassword) {
          localStorage.setItem('zeke_admin_authenticated', 'true');
          setIsAuthenticated(true);
          setIsLoading(false);
        } else if (!activePassword && username.trim() && password.trim()) {
          // If no custom local password set yet and Supabase is offline, save input as custom password
          saveAdminPassword(password.trim());
          localStorage.setItem('zeke_admin_authenticated', 'true');
          setIsAuthenticated(true);
          setIsLoading(false);
        } else {
          setAuthError('Invalid credentials. Please verify your username and password.');
          setIsLoading(false);
        }
      }, 500);
    }
  };

  // Status Badge Helper for Leads
  // Status Badge Helper for Portfolio
  const getPortfolioStatusBadge = (status: ExtendedPortfolioProject['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-[#111111] text-white border border-[#111111] font-mono font-bold shadow-2xs';
      case 'Ongoing':
      case 'Under Construction':
      case 'Planning Phase':
      default:
        return 'bg-[#C8102E] text-white border border-[#A00B22] font-mono font-bold shadow-2xs';
    }
  };

  // Confirmation Modal States
  interface ConfirmationModalConfig {
    type: 'delete_project' | 'bulk_delete_projects' | 'restore_vault' | 'bulk_restore_vault' | 'permanent_delete_vault' | 'bulk_permanent_delete_vault';
    title: string;
    actionName: string;
    details: string;
    confirmText: string;
    theme: 'danger' | 'success';
    payload?: any;
  }

  interface ActionSuccessConfig {
    title: string;
    details: string;
  }

  const [pendingConfirmation, setPendingConfirmation] = useState<ConfirmationModalConfig | null>(null);
  const [actionSuccessResult, setActionSuccessResult] = useState<ActionSuccessConfig | null>(null);

  // --- PORTFOLIO ACTIONS ---
  const handleSingleDeleteProject = (proj: ExtendedPortfolioProject) => {
    setPendingConfirmation({
      type: 'delete_project',
      title: 'CONFIRM DELETION',
      actionName: 'Delete Project',
      details: `You are about to delete project "${proj.title}" (${proj.designatedCategory}). It will be moved to the Archive / Trash vault.`,
      confirmText: 'Yes, Confirm Deletion',
      theme: 'danger',
      payload: proj
    });
  };

  const handleBulkDeletePortfolio = () => {
    const count = selectedPortfolioIds.length;
    if (count === 0) return;
    setPendingConfirmation({
      type: 'bulk_delete_projects',
      title: 'CONFIRM BULK DELETION',
      actionName: 'Bulk Delete Projects',
      details: `You are about to delete ${count} selected project(s). They will be moved to the Archive / Trash vault.`,
      confirmText: `Yes, Confirm Delete (${count})`,
      theme: 'danger'
    });
  };

  // --- VAULT ACTIONS ---
  const handleRestoreVaultItem = (item: TrashItem) => {
    setPendingConfirmation({
      type: 'restore_vault',
      title: 'CONFIRM RECOVERY',
      actionName: 'Recover Vault Item',
      details: `You are about to recover item ${item.stampId} (${item.entityDetails}) and restore it to the active Portfolio.`,
      confirmText: 'Yes, Confirm Recovery',
      theme: 'success',
      payload: item
    });
  };

  const handlePermanentDeleteVaultItem = (id: string) => {
    const item = vaultList.find((v) => v.id === id);
    const label = item ? `${item.stampId} (${item.entityDetails})` : id;
    setPendingConfirmation({
      type: 'permanent_delete_vault',
      title: 'CONFIRM PERMANENT PURGE',
      actionName: 'Permanent Purge',
      details: `You are about to permanently purge ${label}. This action cannot be undone.`,
      confirmText: 'Yes, Confirm Purge',
      theme: 'danger',
      payload: id
    });
  };

  const handleBulkRestoreVault = () => {
    const count = selectedVaultIds.length;
    if (count === 0) return;
    setPendingConfirmation({
      type: 'bulk_restore_vault',
      title: 'CONFIRM BULK RECOVERY',
      actionName: 'Bulk Recover Items',
      details: `You are about to recover ${count} selected item(s) and restore them to the active Portfolio.`,
      confirmText: `Yes, Confirm Recovery (${count})`,
      theme: 'success'
    });
  };

  const handleBulkPermanentDeleteVault = () => {
    const count = selectedVaultIds.length;
    if (count === 0) return;
    setPendingConfirmation({
      type: 'bulk_permanent_delete_vault',
      title: 'CONFIRM BULK PURGE',
      actionName: 'Bulk Permanent Purge',
      details: `You are about to permanently purge ${count} selected item(s). This action cannot be undone.`,
      confirmText: `Yes, Confirm Purge (${count})`,
      theme: 'danger'
    });
  };

  // Execution Handler after Confirmation
  const executeConfirmedAction = () => {
    if (!pendingConfirmation) return;

    const { type, payload } = pendingConfirmation;
    let successTitle = 'ACTION CONFIRMED!';
    let successDetails = 'Action confirmed! The operation was successfully processed.';

    if (type === 'delete_project') {
      const proj = payload as ExtendedPortfolioProject;
      setPortfolioList((prev) => prev.filter((item) => item.id !== proj.id));
      setSelectedPortfolioIds((prev) => prev.filter((id) => id !== proj.id));
      if (inspectingProject?.id === proj.id) setInspectingProject(null);
      if (editingProject?.id === proj.id) setEditingProject(null);
      const newTrash: TrashItem = {
        id: `#ARCH-${Math.floor(1000 + Math.random() * 9000)}`,
        vaultOrigin: 'Portfolio',
        stampId: `#ARCH-${Math.floor(1000 + Math.random() * 9000)} | Deleted on: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
        entityDetails: `${proj.designatedCategory || proj.title} (${proj.assetYear || proj.year || '2026'})`,
        deletedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        originalData: proj
      };
      setVaultList((prev) => [newTrash, ...prev]);
      successTitle = 'ACTION CONFIRMED!';
      successDetails = `Action confirmed! Project "${proj.title}" was moved to Archive / Trash.`;
    } else if (type === 'bulk_delete_projects') {
      const deleteIds = new Set(selectedPortfolioIds);
      const toDelete = portfolioList.filter((item) => deleteIds.has(item.id));
      setPortfolioList((prev) => prev.filter((item) => !deleteIds.has(item.id)));
      if (inspectingProject && deleteIds.has(inspectingProject.id)) setInspectingProject(null);
      if (editingProject && deleteIds.has(editingProject.id)) setEditingProject(null);
      const newTrashes: TrashItem[] = toDelete.map((proj) => ({
        id: `#ARCH-${Math.floor(1000 + Math.random() * 9000)}`,
        vaultOrigin: 'Portfolio',
        stampId: `#ARCH-${Math.floor(1000 + Math.random() * 9000)} | Deleted on: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
        entityDetails: `${proj.designatedCategory || proj.title} (${proj.assetYear || proj.year || '2026'})`,
        deletedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        originalData: proj
      }));
      setVaultList((prev) => [...newTrashes, ...prev]);
      const count = selectedPortfolioIds.length;
      setSelectedPortfolioIds([]);
      successTitle = 'ACTION CONFIRMED!';
      successDetails = `Action confirmed! ${count} selected project(s) were moved to Archive / Trash.`;
    } else if (type === 'restore_vault') {
      const item = payload as TrashItem;
      setVaultList((prev) => prev.filter((t) => t.id !== item.id));
      setSelectedVaultIds((prev) => prev.filter((id) => id !== item.id));

      let projToRestore: ExtendedPortfolioProject;
      if (item.originalData) {
        projToRestore = item.originalData;
      } else {
        const titleExtract = item.entityDetails.split('(')[0]?.trim() || item.entityDetails;
        projToRestore = {
          id: `PRJ-${Math.floor(100 + Math.random() * 900)}`,
          assetYear: `ID: #PRJ-${Math.floor(100 + Math.random() * 900)} | Est. 2026`,
          title: titleExtract,
          category: 'Construction',
          designatedCategory: item.entityDetails,
          location: 'Metro Manila',
          clientLocation: 'Restored Record • Metro Manila',
          status: 'Ongoing',
          year: '2026',
          area: '25,000 sq ft',
          client: 'Restored Enterprise Asset',
          imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?auto=format&fit=crop&w=800&q=80',
          description: `Restored archive project entity: ${item.entityDetails}`
        };
      }

      setPortfolioList((prev) => {
        if (prev.some((p) => p.id === projToRestore.id)) return prev;
        return [projToRestore, ...prev];
      });
      successTitle = 'ACTION CONFIRMED!';
      successDetails = `Action confirmed! Item ${item.stampId} was successfully recovered and restored to Portfolio.`;
    } else if (type === 'bulk_restore_vault') {
      const restoreVaultIds = new Set(selectedVaultIds);
      const toRestore = vaultList.filter((t) => restoreVaultIds.has(t.id));

      setVaultList((prev) => prev.filter((t) => !restoreVaultIds.has(t.id)));

      const restoredProjects: ExtendedPortfolioProject[] = toRestore.map((item, idx) => {
        if (item.originalData) return item.originalData;
        const titleExtract = item.entityDetails.split('(')[0]?.trim() || item.entityDetails;
        return {
          id: `PRJ-${Math.floor(100 + Math.random() * 900)}-${idx}`,
          assetYear: `ID: #PRJ-${Math.floor(100 + Math.random() * 900)} | Est. 2026`,
          title: titleExtract,
          category: 'Construction',
          designatedCategory: item.entityDetails,
          location: 'Metro Manila',
          clientLocation: 'Restored Record • Metro Manila',
          status: 'Ongoing',
          year: '2026',
          area: '25,000 sq ft',
          client: 'Restored Enterprise Asset',
          imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?auto=format&fit=crop&w=800&q=80',
          description: `Restored archive project entity: ${item.entityDetails}`
        };
      });

      setPortfolioList((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newToAdd = restoredProjects.filter((p) => !existingIds.has(p.id));
        return [...newToAdd, ...prev];
      });

      const count = selectedVaultIds.length;
      setSelectedVaultIds([]);
      successTitle = 'ACTION CONFIRMED!';
      successDetails = `Action confirmed! ${count} selected item(s) were successfully recovered and restored to Portfolio.`;
    } else if (type === 'permanent_delete_vault') {
      const id = payload as string;
      setVaultList((prev) => prev.filter((t) => t.id !== id));
      setSelectedVaultIds((prev) => prev.filter((i) => i !== id));
      successTitle = 'ACTION CONFIRMED!';
      successDetails = `Action confirmed! Item ${id} was permanently purged.`;
    } else if (type === 'bulk_permanent_delete_vault') {
      const count = selectedVaultIds.length;
      setVaultList((prev) => prev.filter((t) => !selectedVaultIds.includes(t.id)));
      setSelectedVaultIds([]);
      successTitle = 'ACTION CONFIRMED!';
      successDetails = `Action confirmed! ${count} selected item(s) were permanently purged.`;
    }

    setPendingConfirmation(null);
    setActionSuccessResult({
      title: successTitle,
      details: successDetails
    });
  };

  // Add Project
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle) return;
    const newProj: ExtendedPortfolioProject = {
      id: `proj-${Date.now()}`,
      title: newProjectTitle,
      category: newProjectCategory,
      location: newProjectLocation || 'Los Angeles, CA',
      year: '2026',
      area: '45,000 sq ft',
      client: 'Private Commercial Client',
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?auto=format&fit=crop&w=1200&q=80',
      description: 'Newly added structural development project engineered by Zeke Realty & Construction.',
      highlights: ['Turnkey Certificate of Occupancy', 'Zero Cal/OSHA Safety Incidents'],
      assetYear: '2026',
      designatedCategory: newProjectCategory,
      clientLocation: newProjectLocation || 'Los Angeles, CA',
      status: 'Ongoing',
      liveUrl: 'https://zekedevelopment.com'
    };
    setPortfolioList([newProj, ...portfolioList]);
    setShowAddProjectModal(false);
    setNewProjectTitle('');
    setNewProjectLocation('');
    setNewProjectBudget('');
  };

  /* =========================================================================
     1. SIGN-IN VIEW (SPLIT SCREEN INSPIRED BY REFERENCE DESIGN)
     ========================================================================= */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-black text-white flex flex-col lg:flex-row font-sans overflow-hidden">
        {/* LEFT COLUMN: HIGH-IMPACT BRAND & BACKGROUND ARCHITECTURE (DESKTOP ONLY) */}
        <div className="hidden lg:flex relative lg:w-1/2 min-h-screen bg-[#111111] flex-col justify-between p-8 sm:p-12 lg:p-16 border-r border-zinc-800 overflow-hidden">
          {/* Background Construction Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={ADMIN_LOGIN_IMAGE}
              alt="Admin Portal Background by Zeke Realty & Construction"
              className="w-full h-full object-cover object-center grayscale contrast-110 opacity-40"
              referrerPolicy="no-referrer"
            />
            {/* Dark Linear Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-black/60" />
            {/* Technical Blueprint Grid Pattern */}
            <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none" />
          </div>

          {/* Left Top Brand Tag */}
          <div className="relative z-10 flex items-center gap-3">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-zinc-300">
              MRJL CONSTRUCTION CORPORATION
            </span>
          </div>

          {/* Left Center Content */}
          <div className="relative z-10 my-auto py-12">
            <div className="w-12 h-1 bg-[#003399] mb-6" />
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-none tracking-tight mb-4 uppercase">
              WELCOME BACK. <br />
              <span className="shiny-text-red">ADMIN</span> PORTAL
            </h1>
            <p className="font-body text-zinc-300 text-sm sm:text-base max-w-md leading-relaxed">
              Manage client project leads, review architectural inquiries, and publish portfolio case studies in one unified workspace.
            </p>
          </div>

          {/* Left Bottom Footer */}
          <div className="relative z-10 font-mono text-[11px] uppercase tracking-widest text-zinc-500 flex flex-wrap items-center gap-4 border-t border-zinc-800/80 pt-6">
            <span>AUTHORIZED PERSONNEL ONLY</span>
            <span>•</span>
            <span>© {new Date().getFullYear()} MRJL CONSTRUCTION CORPORATION</span>
          </div>
        </div>

        {/* RIGHT COLUMN: CLEAN SIGN IN FORM AREA */}
        <div className="relative w-full lg:w-1/2 min-h-screen bg-white text-zinc-900 flex flex-col justify-between p-6 sm:p-12 lg:p-20">
          {/* Top Right Exit Button (X) */}
          <button
            onClick={() => onNavigateHome('hero')}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-2.5 text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors rounded-none cursor-pointer"
            title="Return to Main Site"
            aria-label="Exit Admin Portal"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Main Form Center Box (Supports Login and Inline Passphrase Reset Modes) */}
          <div className="my-auto max-w-md w-full mx-auto py-8">
            {/* Mobile / Tablet Brand Header */}
            <div className="mb-4 lg:hidden">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF5500]">
                MRJL CONSTRUCTION CORPORATION
              </span>
            </div>

            {authMode === 'login' ? (
              <>
                <div className="mb-8">
                  <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 uppercase mb-2">
                    ADMIN SIGN IN
                  </h2>
                  <p className="font-body text-xs sm:text-sm text-zinc-500 leading-relaxed">
                    Please enter your credentials below to access the administrative control panel.
                  </p>
                </div>

                {authError && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-[#FF5500] flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#FF5500] shrink-0 mt-0.5" />
                    <p className="text-xs font-body text-red-800 font-medium">{authError}</p>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Field 1: User Identification */}
                  <div>
                    <label className="block font-mono text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
                      [ USER IDENTIFICATION ]
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter email or username"
                      required
                      className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-300 text-zinc-900 font-mono text-xs sm:text-sm focus:outline-none focus:border-[#003399] focus:bg-white transition-all rounded-none"
                    />
                  </div>

                  {/* Field 2: Security Passphrase */}
                  <div>
                    <label className="block mb-2 font-mono text-xs font-bold uppercase tracking-wider text-zinc-700">
                      [ SECURITY PASSPHRASE ]
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                      className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-300 text-zinc-900 font-mono text-xs sm:text-sm focus:outline-none focus:border-[#003399] focus:bg-white transition-all rounded-none"
                    />
                    <div className="flex justify-end mt-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('forgot');
                          setAuthError(null);
                        }}
                        className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-500 hover:text-[#FF5500] transition-colors cursor-pointer"
                      >
                        FORGOT PASSPHRASE?
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-[#003399] hover:bg-[#FF5500] text-white font-display font-bold text-xs sm:text-sm uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 rounded-none shadow-md"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>VERIFYING CREDENTIALS...</span>
                      </>
                    ) : (
                      <span>INITIATE SESSION</span>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 uppercase mb-2">
                    RESET SECURITY PASSPHRASE
                  </h2>
                  <p className="font-body text-xs sm:text-sm text-zinc-500 leading-relaxed">
                    Enter your administrative email address to receive an encrypted security reset link.
                  </p>
                </div>

                {forgotSuccess ? (
                  <div className="p-6 bg-emerald-50 border-l-4 border-emerald-600 text-emerald-950 font-body space-y-4 shadow-sm mb-6">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <p className="font-bold text-sm font-mono uppercase tracking-wider">Passphrase Reset Email Transmitted</p>
                    </div>
                    <p className="text-xs text-emerald-900 leading-relaxed">
                      Check your inbox for <strong className="font-mono text-emerald-950">{forgotEmail}</strong> to complete account verification and set a new passphrase.
                    </p>
                    <div className="pt-2 flex justify-start">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('login');
                          setForgotSuccess(false);
                          setForgotEmail('');
                        }}
                        className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#FF5500] hover:text-black hover:underline transition-all cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>RETURN TO LOGIN</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (forgotEmail.trim()) {
                        setIsLoading(true);
                        if (isSupabaseConfigured()) {
                          await requestPasswordResetInSupabase(forgotEmail.trim());
                        }
                        setIsLoading(false);
                        setForgotSuccess(true);
                      }
                    }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
                        [ REGISTERED EMAIL ]
                      </label>
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="Enter registered email address"
                        className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-300 text-zinc-900 font-mono text-xs sm:text-sm focus:outline-none focus:border-[#003399] focus:bg-white transition-all rounded-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-[#003399] hover:bg-[#FF5500] text-white font-display font-bold text-xs sm:text-sm uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 rounded-none shadow-md"
                    >
                      <span>TRANSMIT RESET LINK</span>
                    </button>

                    <div className="flex justify-center pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('login');
                          setForgotSuccess(false);
                        }}
                        className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-[#FF5500] hover:underline transition-all cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>RETURN TO LOGIN</span>
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     2. SIGNED-IN ADMIN CONTROL PANEL DASHBOARD
     ========================================================================= */
  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#1E293B] font-sans flex flex-col lg:flex-row overflow-x-hidden">
      
      {/* MOBILE SIDEBAR TRIGGER HEADER */}
      <div className="lg:hidden bg-[#111111] text-white p-4 flex items-center justify-between border-b border-zinc-800 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img
            src="https://cdn.phototourl.com/member/2026-10-21-8789a8b4-f948-48af-9b7f-f8d183cea43b.png"
            alt="Admin Logo"
            className="h-9 w-auto object-contain shrink-0"
          />
          <div className="flex flex-col justify-center">
            <h1 className="font-display font-black text-base uppercase tracking-tight text-white leading-none">
              MRJL
            </h1>
            <p className="font-mono text-[8.5px] font-bold text-[#FF5500] uppercase tracking-[0.22em] leading-none mt-1 block whitespace-nowrap">
              CONTROL PANEL
            </p>
          </div>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-zinc-300 hover:text-white bg-zinc-800 rounded cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        />
      )}

      {/* A. LEFT SIDEBAR (Dark - #111111) */}
      <aside
        className={`fixed top-0 left-0 bottom-0 h-screen w-72 bg-[#111111] text-white flex flex-col justify-between border-r border-zinc-800 transition-transform duration-300 transform z-50 overflow-y-auto ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full justify-between">
          <div>
            {/* Brand Header */}
            <div className="p-6 border-b border-zinc-800 flex items-center gap-3.5">
              <img
                src="https://cdn.phototourl.com/member/2026-10-21-8789a8b4-f948-48af-9b7f-f8d183cea43b.png"
                alt="Admin Logo"
                className="max-h-11 w-auto object-contain shrink-0"
              />
              <div className="flex flex-col justify-center">
                <h1 className="font-display font-black text-lg uppercase tracking-tight text-white leading-none">
                  MRJL
                </h1>
                <p className="font-mono text-[9px] font-bold text-[#FF5500] uppercase tracking-[0.22em] leading-none mt-1.5 block whitespace-nowrap">
                  CONTROL PANEL
                </p>
              </div>
            </div>

            {/* Navigation Menu Items */}
            <div className="p-4 space-y-[15px]">
              {/* 1. Portfolio Manager */}
              <button
                onClick={() => {
                  setActiveTab('portfolio');
                  setInspectingProject(null);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 mt-[30px] rounded-lg text-sm font-display font-bold uppercase tracking-wider transition-all cursor-pointer text-left ${
                  activeTab === 'portfolio'
                    ? 'border border-white bg-white/15 text-white shadow-sm'
                    : 'border border-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/80'
                }`}
              >
                <div className="flex items-center gap-3 whitespace-nowrap">
                  <FolderKanban className="w-4 h-4 shrink-0" />
                  <span>Portfolio Manager</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 transition-opacity shrink-0 ml-2 ${activeTab === 'portfolio' ? 'opacity-100' : 'opacity-0'}`} />
              </button>

              {/* 4. Blog Manager */}
              {/* 4. Archive / Trash */}
              <button
                onClick={() => {
                  setActiveTab('trash');
                  setInspectingProject(null);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-display font-bold uppercase tracking-wider transition-all cursor-pointer text-left ${
                  activeTab === 'trash'
                    ? 'border border-white bg-white/15 text-white shadow-sm'
                    : 'border border-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/80'
                }`}
              >
                <div className="flex items-center gap-3 whitespace-nowrap">
                  <Trash2 className="w-4 h-4 shrink-0" />
                  <span>Archive / Trash</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 transition-opacity shrink-0 ml-2 ${activeTab === 'trash' ? 'opacity-100' : 'opacity-0'}`} />
              </button>
            </div>
          </div>

          {/* Bottom Menu Items */}
          <div className="p-4 border-t border-zinc-800 space-y-[15px]">
            {/* 6. System Settings */}
            <button
              onClick={() => {
                setActiveTab('settings');
                setInspectingProject(null);
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-display font-bold uppercase tracking-wider transition-all cursor-pointer text-left ${
                activeTab === 'settings'
                  ? 'border border-white bg-white/15 text-white shadow-sm'
                  : 'border border-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">System Settings</span>
            </button>

            {/* 7. Logout */}
            <button
              onClick={() => {
                localStorage.removeItem('zeke_admin_authenticated');
                setIsAuthenticated(false);
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-display font-bold uppercase tracking-wider text-red-400 hover:text-white hover:bg-red-950/50 transition-all cursor-pointer border-l-4 border-transparent text-left"
            >
              <LogOut className="w-4 h-4 text-[#C8102E] shrink-0" />
              <span className="whitespace-nowrap">Logout</span>
            </button>


          </div>
        </div>
      </aside>

      {/* RIGHT MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F4F5F7] lg:ml-72">
        
        {/* B. TOP UTILITY HEADER (Light Surface) */}
        <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-30 px-6 py-5 flex items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                setPortfolioSearch(val);
                setVaultSearch(val);
                setPortfolioPage(1);
                setVaultPage(1);
              }}
              placeholder="Search projects, archive items..."
              className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-mono text-[#1E293B] placeholder-[#94A3B8] rounded-lg focus:outline-none focus:border-[#C8102E] transition-all"
            />
          </div>

          {/* Quick Action Widgets */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Language / Status / Public Site Icon */}
            <button
              onClick={() => onNavigatePage('home')}
              className="p-2 text-[#64748B] hover:text-[#111111] hover:bg-[#F1F5F9] rounded-full transition-colors cursor-pointer relative"
              title="View Public Website (Stay Logged In)"
            >
              <Globe className="w-5 h-5" />
            </button>


          </div>
        </header>

        {/* C. MAIN DASHBOARD CONTENT AREA */}
        <main className="flex-1 p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto">
          
          {/* ==================== PORTFOLIO MANAGER TAB ==================== */}




          {/* ==================== LEADS REMOVED ==================== */}

          {false && (
            <div>
                  {/* A. TOP HEADER NAVIGATION BAR */}
                  <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left Content Group */}
                    <div className="flex items-start sm:items-center gap-3.5">
                      {/* Back Button */}
                      <button
                        type="button"
                        onClick={() => setInspectingLead(null)}
                        className="p-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#111111] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all cursor-pointer flex items-center justify-center shadow-2xs group shrink-0"
                        title="Return to Leads Manager"
                      >
                        <ArrowLeft className="w-5 h-5 text-[#111111] group-hover:-translate-x-0.5 transition-transform" />
                      </button>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[10px] font-bold text-[#64748B] tracking-wider uppercase">
                            LEAD INQUIRY RECORD
                          </span>
                          <span className="text-zinc-300">•</span>
                          <span className="font-mono text-xs font-bold text-[#C8102E]">
                            {inspectingLead.id}
                          </span>
                        </div>
                        <h1 className="font-display font-black text-xl sm:text-2xl text-[#111111] uppercase tracking-tight">
                          INQUIRY OF {inspectingLead.clientName.toUpperCase()}
                        </h1>
                        <div className="flex flex-wrap items-center gap-2.5 mt-2">
                          {/* Active status badge pill */}
                          <span
                            className={`px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider rounded-md shadow-2xs ${getLeadStatusBadge(
                              inspectingLead.status
                            )}`}
                          >
                            {inspectingLead.status === 'Closed' ? 'ARCHIVED' : inspectingLead.status}
                          </span>
                          <span className="text-zinc-300">•</span>
                          {/* Received Timestamp */}
                          <span className="font-mono text-xs text-[#64748B] flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                            RECEIVED ON {inspectingLead.ingestTime.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Content Group: Secondary Action Button */}
                    <div className="flex items-center gap-2 self-start md:self-auto">
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete lead record ${inspectingLead.id} for ${inspectingLead.clientName}?`)) {
                            handleSingleDeleteLead(inspectingLead);
                            setInspectingLead(null);
                          }
                        }}
                        className="px-4 py-2.5 rounded-lg border border-red-200 bg-red-50/60 hover:bg-red-100 text-[#C8102E] font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-2xs"
                      >
                        <Trash2 className="w-4 h-4 text-[#C8102E]" />
                        <span>DELETE RECORD</span>
                      </button>
                    </div>
                  </div>

                  {/* B. ASYMMETRIC MAIN GRID LAYOUT (Left 65% / Right 35%) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* ==================== LEFT COLUMN (PRIMARY INQUIRY DATA - Stacked Cards: 65%) ==================== */}
                    <div className="lg:col-span-8 space-y-6">
                      {/* CARD 1: CLIENT CONTACT & PROFILE */}
                      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-xs overflow-hidden">
                        <div className="p-4 sm:p-5 border-b border-[#F1F5F9] bg-[#FFFFFF] flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-200 text-[#C8102E] flex items-center justify-center shrink-0">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-display font-black text-sm text-[#111111] uppercase tracking-tight">
                              CLIENT CONTACT & PROFILE
                            </h3>
                            <p className="font-mono text-[10px] text-[#64748B] uppercase tracking-wider mt-0.5">
                              CONTACT INFO & PROPERTY CLASSIFICATION
                            </p>
                          </div>
                        </div>

                        <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {/* Field 1: FULL NAME */}
                          <div className="space-y-1">
                            <span className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                              FULL NAME
                            </span>
                            <p className="font-sans font-bold text-sm text-[#111111]">
                              {inspectingLead.clientName}
                            </p>
                          </div>

                          {/* Field 2: PROPERTY CATEGORY / SECTOR */}
                          <div className="space-y-1">
                            <span className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                              PROPERTY CATEGORY / SECTOR
                            </span>
                            <p className="font-sans font-bold text-sm text-[#111111]">
                              {inspectingLead.propertyCategory || inspectingLead.sectorScope.split('•')[0].trim()}
                            </p>
                          </div>

                          {/* Field 3: EMAIL ADDRESS */}
                          <div className="space-y-1">
                            <span className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                              EMAIL ADDRESS
                            </span>
                            <a
                              href={`mailto:${inspectingLead.email}`}
                              className="font-mono text-xs font-bold text-[#C8102E] hover:underline flex items-center gap-1.5 transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5 text-[#C8102E]" />
                              <span>{inspectingLead.email}</span>
                            </a>
                          </div>

                          {/* Field 4: MOBILE PHONE NUMBER */}
                          <div className="space-y-1">
                            <span className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                              MOBILE PHONE NUMBER
                            </span>
                            <a
                              href={`tel:${inspectingLead.phone}`}
                              className="font-mono text-xs font-bold text-[#111111] hover:text-[#C8102E] flex items-center gap-1.5 transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-[#64748B]" />
                              <span>{inspectingLead.phone}</span>
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* CARD 2: TECHNICAL & PROJECT SCOPE PARAMETERS */}
                      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-xs overflow-hidden">
                        <div className="p-4 sm:p-5 border-b border-[#F1F5F9] bg-[#FFFFFF] flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 text-[#111111] flex items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-display font-black text-sm text-[#111111] uppercase tracking-tight">
                              TECHNICAL & PROJECT SCOPE PARAMETERS
                            </h3>
                            <p className="font-mono text-[10px] text-[#64748B] uppercase tracking-wider mt-0.5">
                              TECHNICAL AUDIT PARAMETERS • BUDGET & SYSTEM INTEGRATION GOALS
                            </p>
                          </div>
                        </div>

                        <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {/* Field 1: BUDGET / BILLING RANGE */}
                          <div className="space-y-1">
                            <span className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                              BUDGET / BILLING RANGE
                            </span>
                            <p className="font-mono font-bold text-sm text-[#C8102E]">
                              {inspectingLead.budgetRange}
                            </p>
                          </div>

                          {/* Field 2: UTILITY / INFRASTRUCTURE PARTNER */}
                          <div className="space-y-1">
                            <span className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                              UTILITY / INFRASTRUCTURE PARTNER
                            </span>
                            <p className="font-sans font-bold text-xs text-[#111111]">
                              {inspectingLead.utilityPartner || 'Meralco'}
                            </p>
                          </div>

                          {/* Field 3: STRUCTURAL / SCOPE REQUIREMENTS */}
                          <div className="space-y-1">
                            <span className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                              STRUCTURAL / SCOPE REQUIREMENTS
                            </span>
                            <p className="font-sans font-bold text-xs text-[#111111]">
                              {inspectingLead.structuralScope || 'Rib-type Roof / Interior Fit-out'}
                            </p>
                          </div>

                          {/* Field 4: SITE CONDITIONS */}
                          <div className="space-y-1">
                            <span className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                              SITE CONDITIONS
                            </span>
                            <p className="font-sans font-bold text-xs text-[#111111]">
                              {inspectingLead.siteConditions || 'Clear sunlight / Direct road access'}
                            </p>
                          </div>

                          {/* Field 5: PROJECT GOAL */}
                          <div className="space-y-1">
                            <span className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                              PROJECT GOAL
                            </span>
                            <p className="font-sans font-bold text-xs text-[#111111]">
                              {inspectingLead.projectGoal || 'Backup Power / Full Build'}
                            </p>
                          </div>

                          {/* Field 6: TIMELINE / COMMISSION */}
                          <div className="space-y-1">
                            <span className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                              TIMELINE / COMMISSION
                            </span>
                            <p className="font-sans font-bold text-xs text-[#111111]">
                              {inspectingLead.timeline || 'Immediately (2–3 weeks)'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* CARD 3: PHYSICAL SITE & SPECIFICATIONS */}
                      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-xs overflow-hidden">
                        <div className="p-4 sm:p-5 border-b border-[#F1F5F9] bg-[#FFFFFF] flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-display font-black text-sm text-[#111111] uppercase tracking-tight">
                              PHYSICAL SITE & SPECIFICATIONS
                            </h3>
                            <p className="font-mono text-[10px] text-[#64748B] uppercase tracking-wider mt-0.5">
                              PREMISES, AUDIT SCHEDULE & PHOTO ASSETS
                            </p>
                          </div>
                        </div>

                        <div className="p-4 sm:p-5 space-y-6 divide-y divide-[#F1F5F9]">
                          {/* Section A: INSTALLATION / SITE ADDRESS */}
                          <div className="space-y-2">
                            <span className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                              INSTALLATION / SITE ADDRESS
                            </span>
                            <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg flex items-start gap-3">
                              <MapPin className="w-4 h-4 text-[#C8102E] shrink-0 mt-0.5" />
                              <p className="font-sans text-xs text-[#111111] font-semibold leading-relaxed">
                                {inspectingLead.siteAddress || 'Lot 14 Block 8, Horizon Crest Executive Village, Subic Bay Freeport Zone, Zambales 2222'}
                              </p>
                            </div>
                          </div>

                          {/* Section B: DESIGNATED SAFE LOCATION / ACCESS */}
                          <div className="pt-5 space-y-2">
                            <span className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                              DESIGNATED SAFE LOCATION / ACCESS
                            </span>
                            <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                              <p className="font-sans text-xs text-[#111111] leading-relaxed">
                                {inspectingLead.accessNotes || inspectingLead.notes || 'Gated residential community; entry clearance required at Guard Gate 2. Service truck access available directly via West Avenue.'}
                              </p>
                            </div>
                          </div>

                          {/* Section C: ATTACHED SITE PHOTOS */}
                          <div className="pt-5 space-y-2">
                            <span className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-2">
                              ATTACHED SITE PHOTOS
                            </span>

                            {inspectingLead.attachedPhotos && inspectingLead.attachedPhotos.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {inspectingLead.attachedPhotos.map((photo, i) => (
                                  <div
                                    key={i}
                                    className="relative group rounded-xl overflow-hidden border border-[#E2E8F0] aspect-video bg-black/5"
                                  >
                                    <img
                                      src={photo.url}
                                      alt={photo.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                      <span className="font-mono text-xs text-white font-bold truncate">
                                        {photo.title}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] rounded-xl p-6 text-center flex flex-col items-center justify-center text-[#64748B]">
                                <Image className="w-8 h-8 text-[#94A3B8] mb-2 stroke-1" />
                                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#64748B]">
                                  NO VISUAL ATTACHMENTS UPLOADED BY CLIENT
                                </span>
                                <p className="font-sans text-[11px] text-[#94A3B8] mt-1 max-w-sm">
                                  Client did not include site images during initial web form submission. Site audit team will document photographs during the scheduled field inspection.
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Section D: PREFERRED FIELD INSPECTION / SITE AUDIT */}
                          <div className="pt-5 space-y-2">
                            <span className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                              PREFERRED FIELD INSPECTION / SITE AUDIT
                            </span>

                            <div className="flex items-center gap-4 p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                              {/* Left: High-contrast Dark Charcoal date tile */}
                              <div className="bg-[#111111] text-white py-2.5 px-3.5 rounded-lg flex flex-col items-center justify-center min-w-[68px] shrink-0 shadow-xs border border-zinc-800">
                                <span className="font-display font-black text-xl leading-none text-white">
                                  {inspectingLead.auditDate?.day || '26'}
                                </span>
                                <span className="font-mono font-extrabold text-[10px] text-[#C8102E] tracking-widest uppercase mt-0.5">
                                  {inspectingLead.auditDate?.month || 'JUL'}
                                </span>
                              </div>

                              {/* Right: Full Date text + Selected time slot pill */}
                              <div className="flex-1 min-w-0">
                                <span className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-0.5">
                                  CONFIRMED AUDIT APPOINTMENT
                                </span>
                                <p className="font-display font-bold text-sm text-[#111111]">
                                  {inspectingLead.auditDate?.fullDate || 'Sunday, July 26, 2026'}
                                </p>
                                <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-50 border border-red-200 text-[#C8102E] rounded-md font-mono text-[11px] font-bold">
                                  <Clock className="w-3 h-3 text-[#C8102E]" />
                                  <span>{inspectingLead.auditDate?.timeSlot || '9:00 AM - 12:00 PM'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ==================== RIGHT COLUMN (OPERATIONAL CONTROLS & ASSETS - Sidebar Cards: 35%) ==================== */}
                    <div className="lg:col-span-4 space-y-6">
                      {/* CARD 1: LEAD STATUS CONTROL */}
                      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-xs overflow-hidden">
                        <div className="p-4 border-b border-[#F1F5F9] bg-[#FFFFFF] flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#C8102E] animate-pulse" />
                            <h3 className="font-display font-black text-sm text-[#111111] uppercase tracking-tight">
                              LEAD STATUS CONTROL
                            </h3>
                          </div>
                          <span className="font-mono text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200 uppercase">
                            STAGE SELECTOR
                          </span>
                        </div>

                        <div className="p-4 space-y-3">
                          <span className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                            SET STATUS STAGE
                          </span>

                          <div className="space-y-2">
                            {(['New', 'Contacted', 'In Progress', 'Closed'] as LeadInquiry['status'][]).map((st) => {
                              const isActive = inspectingLead.status === st;
                              const displayLabel = st === 'Closed' ? 'ARCHIVED' : st.toUpperCase();

                              return (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => {
                                    setLeadsList((prev) =>
                                      prev.map((l) => (l.id === inspectingLead.id ? { ...l, status: st } : l))
                                    );
                                    setInspectingLead((prev) => (prev ? { ...prev, status: st } : null));
                                  }}
                                  className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between group ${
                                    isActive
                                      ? 'bg-red-50/80 border-[#C8102E] shadow-2xs ring-1 ring-[#C8102E]/30'
                                      : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-white hover:border-[#CBD5E1]'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                        isActive
                                          ? 'border-[#C8102E] bg-[#C8102E]'
                                          : 'border-[#CBD5E1] bg-white group-hover:border-[#94A3B8]'
                                      }`}
                                    >
                                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                    </div>

                                    <span
                                      className={`font-mono text-xs font-bold uppercase tracking-wider ${
                                        isActive ? 'text-[#C8102E]' : 'text-[#111111]'
                                      }`}
                                    >
                                      {displayLabel}
                                    </span>
                                  </div>

                                  {isActive && (
                                    <span className="font-mono text-[9px] font-bold text-[#C8102E] bg-white px-2 py-0.5 rounded border border-red-200">
                                      ACTIVE STAGE
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* CARD 2: ATTACHED DOCUMENTARY ASSETS */}
                      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-xs overflow-hidden">
                        <div className="p-4 border-b border-[#F1F5F9] bg-[#FFFFFF] flex items-center gap-2.5">
                          <Paperclip className="w-4 h-4 text-[#C8102E]" />
                          <div>
                            <h3 className="font-display font-black text-sm text-[#111111] uppercase tracking-tight">
                              ATTACHED DOCUMENTARY ASSETS
                            </h3>
                            <p className="font-mono text-[10px] text-[#64748B] uppercase tracking-wider mt-0.5">
                              SUPPLIED CUSTOMER RECORDS
                            </p>
                          </div>
                        </div>

                        <div className="p-4 space-y-4">
                          <div className="space-y-2.5">
                            {(inspectingLead.documentaryAssets || [
                              { name: 'Client_ROI_Estimate.pdf', size: '2.4 MB', type: 'PDF Document' },
                              { name: 'Structural_Site_Layout_v2.dwg', size: '14.1 MB', type: 'CAD File' }
                            ]).map((doc, idx) => (
                              <div
                                key={idx}
                                className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-xl flex items-center justify-between gap-3 transition-colors group"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 text-[#C8102E] flex items-center justify-center shrink-0">
                                    <FileText className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-mono text-xs font-bold text-[#111111] truncate group-hover:text-[#C8102E] transition-colors">
                                      {doc.name}
                                    </p>
                                    <p className="font-mono text-[10px] text-[#64748B] mt-0.5">
                                      {doc.size} • {doc.type}
                                    </p>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => alert(`Downloading ${doc.name}`)}
                                  className="p-1.5 text-[#64748B] hover:text-[#C8102E] hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                                  title="Download / View Asset"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>

                          <div className="pt-3 border-t border-[#F1F5F9]">
                            <span className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-2">
                              PROPOSED FACILITY / SITE PHOTOS
                            </span>
                            {inspectingLead.attachedPhotos && inspectingLead.attachedPhotos.length > 0 ? (
                              <div className="grid grid-cols-2 gap-2">
                                {inspectingLead.attachedPhotos.map((photo, i) => (
                                  <div key={i} className="relative group rounded-lg overflow-hidden border border-[#E2E8F0] aspect-video">
                                    <img src={photo.url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1">
                                      <span className="font-mono text-[9px] text-white font-bold text-center truncate">{photo.title}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-4 bg-[#F8FAFC] border border-dashed border-[#CBD5E1] rounded-xl text-center">
                                <span className="font-mono text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block">
                                  NO FACILITY PHOTOS SUPPLIED
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                <div className="space-y-5">
                  {/* Header Title Bar */}
                  <div className="pb-5 border-b border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="font-display font-black text-2xl md:text-3xl uppercase tracking-tight text-[#1E293B]">
                        LEADS MANAGER
                      </h2>
                      <p className="font-sans text-sm md:text-base text-[#64748B] mt-1">
                        High-density registry for reviewing, filtering, and dispatching incoming client proposal requests.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#64748B]">Active Inquiries:</span>
                      <span className="px-3 py-1 bg-[#C8102E] text-white font-mono font-bold text-xs rounded-full">
                        {leadsList.length} Total
                      </span>
                    </div>
                  </div>

                  {/* Unified Data Table & Controls Container */}
                  <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
                    {/* Search & Filter Header Bar */}
                    <div className="p-4 border-b border-[#E5E7EB] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                        {/* Real-time Search */}
                        <div className="relative flex-1">
                          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3" />
                          <input
                            type="text"
                            value={leadsSearch}
                            onChange={(e) => {
                              setLeadsSearch(e.target.value);
                              setLeadsPage(1);
                            }}
                            placeholder="Search by ID, client name, email, scope..."
                            className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-mono text-[#1E293B] placeholder-[#94A3B8] rounded-lg focus:outline-none focus:border-[#C8102E]"
                          />
                        </div>

                        {/* Category / Status Filter */}
                        <div className="flex items-center gap-2">
                          <Filter className="w-3.5 h-3.5 text-[#C8102E]" />
                          <select
                            value={leadsStatusFilter}
                            onChange={(e) => {
                              setLeadsStatusFilter(e.target.value);
                              setLeadsPage(1);
                            }}
                            className="px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-mono text-[#1E293B] rounded-lg focus:outline-none focus:border-[#C8102E] cursor-pointer"
                          >
                            <option value="All">All Statuses</option>
                            <option value="New">New</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>
                      </div>

                      {/* Bulk Actions Dropdown & Mass Operations */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={selectedLeadIds.length === 0}
                          onClick={handleBulkDeleteLeads}
                          className={`px-3.5 py-2 text-xs font-mono font-bold uppercase rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                            selectedLeadIds.length > 0
                              ? 'bg-red-50 text-[#C8102E] border-red-200 hover:bg-red-100 shadow-sm'
                              : 'bg-[#F1F5F9] text-[#94A3B8] border-transparent cursor-not-allowed'
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Bulk Archive ({selectedLeadIds.length})</span>
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-sans min-w-[950px]">
                        <thead className="bg-[#FFFFFF] text-[#64748B] font-mono text-[10px] uppercase tracking-wider border-b border-[#E5E7EB]">
                          <tr className="divide-x divide-[#E5E7EB]">
                            {/* 1. Bulk Select Checkbox */}
                            <th className="p-3.5 w-10 text-center bg-[#FFFFFF] sticky left-0 z-10 border-r border-[#E5E7EB] border-l-4 border-l-transparent">
                              <input
                                type="checkbox"
                                checked={
                                  leadsList.length > 0 &&
                                  leadsList.every((item) => selectedLeadIds.includes(item.id))
                                }
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedLeadIds(leadsList.map((item) => item.id));
                                  } else {
                                    setSelectedLeadIds([]);
                                  }
                                }}
                                className="w-4 h-4 accent-[#C8102E] cursor-pointer rounded"
                              />
                            </th>
                            <th className="p-3.5 font-bold">Identifier / Ingest Time</th>
                            <th className="p-3.5 font-bold">Client Name</th>
                            <th className="p-3.5 font-bold">Email Address</th>
                            <th className="p-3.5 font-bold">Phone Number</th>
                            <th className="p-3.5 font-bold">Assigned Sector & Scope</th>
                            <th className="p-3.5 font-bold text-center">Status</th>
                            <th className="p-3.5 font-bold text-center">
                              Operation Dispatch
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB] text-[#1E293B]">
                          {(() => {
                            const filtered = leadsList.filter((lead) => {
                              const matchesSearch =
                                lead.clientName.toLowerCase().includes(leadsSearch.toLowerCase()) ||
                                lead.id.toLowerCase().includes(leadsSearch.toLowerCase()) ||
                                lead.email.toLowerCase().includes(leadsSearch.toLowerCase()) ||
                                lead.sectorScope.toLowerCase().includes(leadsSearch.toLowerCase());
                              const matchesStatus =
                                leadsStatusFilter === 'All' || lead.status === leadsStatusFilter;
                              return matchesSearch && matchesStatus;
                            });

                            const startIndex = (leadsPage - 1) * leadsPerPage;
                            const paginated = filtered.slice(startIndex, startIndex + leadsPerPage);

                            if (paginated.length === 0) {
                              return (
                                <tr>
                                  <td colSpan={8} className="p-10 text-center text-[#94A3B8] font-mono text-xs">
                                    No lead records match the specified query filters.
                                  </td>
                                </tr>
                              );
                            }

                            return paginated.map((lead) => {
                              const isSelected = selectedLeadIds.includes(lead.id);

                              return (
                                <tr
                                  key={lead.id}
                                  className={`transition-colors duration-150 divide-x divide-[#E5E7EB] ${
                                    isSelected ? 'bg-red-50/70' : 'hover:bg-[#F8FAFC]'
                                  }`}
                                >
                                  {/* 1. Selection Checkbox */}
                                  <td className={`p-3.5 text-center sticky left-0 z-10 border-r border-[#E5E7EB] border-l-4 transition-colors ${isSelected ? 'bg-red-50/90 border-l-[#C8102E]' : 'bg-white border-l-transparent'}`}>
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedLeadIds((prev) => [...prev, lead.id]);
                                        } else {
                                          setSelectedLeadIds((prev) =>
                                            prev.filter((id) => id !== lead.id)
                                          );
                                        }
                                      }}
                                      className="w-4 h-4 accent-[#C8102E] cursor-pointer rounded"
                                    />
                                  </td>

                                  {/* 2. Identifier / Ingest Time */}
                                  <td className="p-3.5 whitespace-nowrap">
                                    <div className="font-mono text-xs font-bold text-[#C8102E]">
                                      {lead.id}
                                    </div>
                                    <div className="font-mono text-[10px] text-[#64748B]">
                                      {lead.ingestTime}
                                    </div>
                                  </td>

                                  {/* 3. Client Name */}
                                  <td className="p-3.5 font-bold text-[#1E293B] whitespace-nowrap">
                                    {lead.clientName}
                                  </td>

                                  {/* 4. Email Address */}
                                  <td className="p-3.5 font-mono text-xs text-[#64748B] whitespace-nowrap">
                                    {lead.email}
                                  </td>

                                  {/* 5. Phone Number */}
                                  <td className="p-3.5 font-mono text-xs text-[#64748B] whitespace-nowrap">
                                    {lead.phone}
                                  </td>

                                  {/* 6. Assigned Sector & Project Scope */}
                                  <td className="p-3.5 text-xs text-[#1E293B] max-w-xs truncate">
                                    {lead.sectorScope}
                                  </td>

                                  {/* 7. Status Badge */}
                                  <td className="p-3.5 text-center whitespace-nowrap">
                                    <span
                                      className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-md shadow-xs ${getLeadStatusBadge(
                                        lead.status
                                      )}`}
                                    >
                                      {lead.status}
                                    </span>
                                  </td>

                                  {/* 8. Operation Dispatch Column */}
                                  <td className="p-3.5 text-center whitespace-nowrap">
                                    <div className="flex items-center justify-center gap-1.5">
                                      <ActionIconButton
                                        icon={<Eye className="w-4 h-4" />}
                                        tooltip="View Lead Details"
                                        onClick={() => setInspectingLead(lead)}
                                      />
                                      <ActionIconButton
                                        icon={<Trash2 className="w-4 h-4" />}
                                        tooltip="Delete Lead"
                                        variant="danger"
                                        onClick={() => handleSingleDeleteLead(lead)}
                                      />
                                    </div>
                                  </td>
                                </tr>
                              );
                            });
                          })()}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Controls Bar */}
                    {(() => {
                      const filtered = leadsList.filter((lead) => {
                        const matchesSearch =
                          lead.clientName.toLowerCase().includes(leadsSearch.toLowerCase()) ||
                          lead.id.toLowerCase().includes(leadsSearch.toLowerCase()) ||
                          lead.email.toLowerCase().includes(leadsSearch.toLowerCase()) ||
                          lead.sectorScope.toLowerCase().includes(leadsSearch.toLowerCase());
                        const matchesStatus =
                          leadsStatusFilter === 'All' || lead.status === leadsStatusFilter;
                        return matchesSearch && matchesStatus;
                      });

                      const totalRecords = filtered.length;
                      const totalPages = Math.ceil(totalRecords / leadsPerPage) || 1;
                      const startItem = totalRecords === 0 ? 0 : (leadsPage - 1) * leadsPerPage + 1;
                      const endItem = Math.min(leadsPage * leadsPerPage, totalRecords);

                      return (
                        <div className="bg-[#F8FAFC] border-t border-[#E5E7EB] px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#64748B]">
                          <div className="flex items-center gap-2">
                            <span>Showing {startItem}-{endItem} of {totalRecords} records</span>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <span>Items per page:</span>
                              <select
                                value={leadsPerPage}
                                onChange={(e) => {
                                  setLeadsPerPage(Number(e.target.value));
                                  setLeadsPage(1);
                                }}
                                className="bg-white border border-[#CBD5E1] rounded px-2 py-1 text-xs text-[#1E293B] focus:outline-none focus:border-[#C8102E]"
                              >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                              </select>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={leadsPage === 1}
                                onClick={() => setLeadsPage((prev) => Math.max(1, prev - 1))}
                                className="p-1 rounded border border-[#CBD5E1] bg-white text-[#1E293B] hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <span className="px-2 font-bold text-[#1E293B]">
                                Page {leadsPage} of {totalPages}
                              </span>
                              <button
                                type="button"
                                disabled={leadsPage >= totalPages}
                                onClick={() => setLeadsPage((prev) => Math.min(totalPages, prev + 1))}
                                className="p-1 rounded border border-[#CBD5E1] bg-white text-[#1E293B] hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== PORTFOLIO MANAGER TAB ==================== */}
          {activeTab === 'portfolio' && (
            inspectingProject ? (
              <AdminPortfolioDetailsView
                project={{
                  id: inspectingProject.id,
                  title: inspectingProject.title,
                  client: inspectingProject.client || inspectingProject.clientLocation,
                  clientLocation: inspectingProject.clientLocation,
                  location: inspectingProject.location || inspectingProject.clientLocation,
                  category: inspectingProject.category || inspectingProject.designatedCategory,
                  designatedCategory: inspectingProject.designatedCategory,
                  status: inspectingProject.status,
                  imageUrl: inspectingProject.imageUrl,
                  galleryImages: inspectingProject.galleryImages && inspectingProject.galleryImages.length > 0
                    ? inspectingProject.galleryImages
                    : [inspectingProject.imageUrl],
                  description: inspectingProject.description,
                  detailedScope: (inspectingProject as any).detailedScope,
                  structuralSpecs: (inspectingProject as any).structuralSpecs,
                  inverterEquipment: (inspectingProject as any).inverterEquipment,
                  roiYield: (inspectingProject as any).roiYield,
                  paybackTerm: (inspectingProject as any).paybackTerm,
                  installedCapacity: (inspectingProject as any).installedCapacity,
                  assetYear: inspectingProject.assetYear,
                  liveUrl: inspectingProject.liveUrl
                }}
                onBack={() => setInspectingProject(null)}
                onDelete={(projToDelete) => {
                  handleSingleDeleteProject({
                    id: projToDelete.id,
                    title: projToDelete.title,
                    category: projToDelete.category || 'Civil Works',
                    location: projToDelete.location || 'Metro Manila',
                    year: projToDelete.assetYear || '2026',
                    area: 'N/A',
                    client: projToDelete.client || 'Client',
                    designatedCategory: projToDelete.category || 'Civil Works',
                    clientLocation: projToDelete.location || 'Metro Manila',
                    status: (projToDelete.status as any) || 'Completed',
                    imageUrl: projToDelete.imageUrl,
                    description: projToDelete.description || '',
                    highlights: [],
                    assetYear: projToDelete.assetYear || '2026'
                  });
                  setInspectingProject(null);
                }}
              />
            ) : (
            <div className="space-y-5">
              {/* Header Title Bar */}
              <div className="pb-5 border-b border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-black text-2xl md:text-3xl text-[#1E293B] uppercase tracking-tight">PORTFOLIO MANAGER</h2>
                  <p className="font-sans text-sm md:text-base text-[#64748B] mt-1">Manage, edit, and publish Zeke Realty & Construction showcase builds.</p>
                </div>
                <button
                  onClick={() => setShowAddProjectModal(true)}
                  className="px-4 py-2.5 bg-[#C8102E] hover:bg-red-700 text-white font-display text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Project</span>
                </button>
              </div>

              {/* Unified Data Table & Controls Container */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
                {/* Search & Filter Header Bar */}
                <div className="p-4 border-b border-[#E5E7EB] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={portfolioSearch}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPortfolioSearch(val);
                          setSearchQuery(val);
                          setPortfolioPage(1);
                        }}
                        placeholder="Search projects by title, category, location..."
                        className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-mono text-[#1E293B] placeholder-[#94A3B8] rounded-lg focus:outline-none focus:border-[#003399]"
                      />
                    </div>

                    {/* Category Filter & Status Filter */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <Filter className="w-3.5 h-3.5 text-[#003399] shrink-0" />
                        <div className="relative inline-block">
                          <select
                            value={portfolioCategoryFilter}
                            onChange={(e) => {
                              setPortfolioCategoryFilter(e.target.value);
                              setPortfolioPage(1);
                            }}
                            className="appearance-none pl-3 pr-8 py-2 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-mono text-[#1E293B] rounded-lg focus:outline-none focus:border-[#003399] cursor-pointer"
                          >
                            <option value="All">All Categories</option>
                            <option value="Residential Construction">Residential Construction</option>
                            <option value="Commercial Construction">Commercial Construction</option>
                            <option value="Renovation & Retrofitting">Renovation & Retrofitting</option>
                            <option value="Interior Fit-Out">Interior Fit-Out</option>
                            <option value="Waterproofing">Waterproofing</option>
                            <option value="Gate & Fence Construction">Gate & Fence Construction</option>
                            <option value="Additions & Extensions">Additions & Extensions</option>
                            <option value="Land Development">Land Development</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div className="relative inline-block">
                        <select
                          value={portfolioStatusFilter}
                          onChange={(e) => {
                            setPortfolioStatusFilter(e.target.value);
                            setPortfolioPage(1);
                          }}
                          className="appearance-none pl-3 pr-8 py-2 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-mono text-[#1E293B] rounded-lg focus:outline-none focus:border-[#003399] cursor-pointer"
                        >
                          <option value="All">All Statuses</option>
                          <option value="Ongoing">Ongoing</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bulk Selection Action Bar - Appears below search bar when checkboxes are selected */}
                {selectedPortfolioIds.length > 0 && (
                  <div className="px-4 py-2.5 bg-red-50/70 border-b border-red-100 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={handleBulkDeletePortfolio}
                      className="px-3.5 py-1.5 text-xs font-mono font-bold uppercase rounded-lg border border-red-200 bg-white text-[#C8102E] hover:bg-[#C8102E] hover:text-white hover:border-[#C8102E] shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Bulk Archive</span>
                    </button>

                    <span className="font-mono text-xs font-bold text-[#C8102E] uppercase tracking-wider">
                      {selectedPortfolioIds.length} selected
                    </span>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans min-w-[950px]">
                    <thead className="bg-[#FFFFFF] text-[#64748B] font-mono text-[10px] uppercase tracking-wider border-b border-[#E5E7EB]">
                      <tr className="divide-x divide-[#E5E7EB]">
                        <th className="p-4 px-3 w-12 text-center bg-[#FFFFFF] sticky left-0 z-10 border-r border-[#E5E7EB] border-l-4 border-l-transparent">
                          <input
                            type="checkbox"
                            checked={
                              portfolioList.length > 0 &&
                              portfolioList.every((item) => selectedPortfolioIds.includes(item.id))
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPortfolioIds(portfolioList.map((item) => item.id));
                              } else {
                                setSelectedPortfolioIds([]);
                              }
                            }}
                            className="w-4 h-4 accent-[#C8102E] cursor-pointer rounded"
                          />
                        </th>
                        <th className="p-4 px-3 font-bold text-[#64748B]">ASSET PREVIEW & ID</th>
                        <th className="p-4 px-3 font-bold text-[#64748B]">TITLE & SERVICE CATEGORY</th>
                        <th className="p-4 px-3 font-bold text-[#64748B]">CLIENT & LOCATION METADATA</th>
                        <th className="p-4 px-3 font-bold text-[#64748B] text-center">STATUS</th>
                        <th className="p-4 px-3 font-bold text-[#64748B] text-right pr-6">
                          OPERATION DISPATCH
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] text-[#111111]">
                      {(() => {
                        const filtered = portfolioList.filter((proj) => {
                          const matchesSearch =
                            proj.title.toLowerCase().includes(portfolioSearch.toLowerCase()) ||
                            proj.designatedCategory.toLowerCase().includes(portfolioSearch.toLowerCase()) ||
                            proj.clientLocation.toLowerCase().includes(portfolioSearch.toLowerCase());
                          const matchesStatus =
                            portfolioStatusFilter === 'All' || proj.status === portfolioStatusFilter;
                          const combinedCat = `${proj.category || ''} ${proj.designatedCategory || ''}`.toLowerCase();
                          const filterLower = portfolioCategoryFilter.toLowerCase();
                          let matchesCategory = false;
                          if (portfolioCategoryFilter === 'All') {
                            matchesCategory = true;
                          } else if (filterLower.includes('residential')) {
                            matchesCategory = combinedCat.includes('residential');
                          } else if (filterLower.includes('commercial')) {
                            matchesCategory = combinedCat.includes('commercial');
                          } else if (filterLower.includes('planning')) {
                            matchesCategory = combinedCat.includes('planning') || combinedCat.includes('design');
                          } else if (filterLower.includes('renovation') || filterLower.includes('retrofitting')) {
                            matchesCategory = combinedCat.includes('renovation') || combinedCat.includes('retrofitting');
                          } else if (filterLower.includes('interior')) {
                            matchesCategory = combinedCat.includes('interior');
                          } else if (filterLower.includes('waterproofing')) {
                            matchesCategory = combinedCat.includes('waterproofing');
                          } else if (filterLower.includes('gate') || filterLower.includes('fence')) {
                            matchesCategory = combinedCat.includes('gate') || combinedCat.includes('fence');
                          } else if (filterLower.includes('addition') || filterLower.includes('extension')) {
                            matchesCategory = combinedCat.includes('addition') || combinedCat.includes('extension');
                          } else if (filterLower.includes('land')) {
                            matchesCategory = combinedCat.includes('land') || combinedCat.includes('development');
                          } else {
                            matchesCategory = combinedCat.includes(filterLower);
                          }

                          return matchesSearch && matchesStatus && matchesCategory;
                        });

                        const startIndex = (portfolioPage - 1) * portfolioPerPage;
                        const paginated = filtered.slice(startIndex, startIndex + portfolioPerPage);

                        if (paginated.length === 0) {
                          return (
                            <tr>
                              <td colSpan={6} className="p-10 text-center text-[#94A3B8] font-mono text-xs">
                                No portfolio projects matched your search criteria.
                              </td>
                            </tr>
                          );
                        }

                        return paginated.map((proj) => {
                          const isSelected = selectedPortfolioIds.includes(proj.id);

                          return (
                            <tr
                              key={proj.id}
                              className={`transition-colors duration-150 divide-x divide-[#E5E7EB] ${
                                isSelected ? 'bg-red-50/70' : 'bg-white hover:bg-[#F8FAFC]'
                              }`}
                            >
                              {/* 1. BULK SELECTION (Checkbox Cell) */}
                              <td className={`p-4 px-3 w-12 text-center sticky left-0 z-10 border-r border-[#E5E7EB] border-l-4 transition-colors ${isSelected ? 'bg-red-50/90 border-l-[#C8102E]' : 'bg-white border-l-transparent'}`}>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedPortfolioIds((prev) => [...prev, proj.id]);
                                    } else {
                                      setSelectedPortfolioIds((prev) =>
                                        prev.filter((id) => id !== proj.id)
                                      );
                                    }
                                  }}
                                  className="w-4 h-4 accent-[#C8102E] cursor-pointer rounded"
                                />
                              </td>

                              {/* 2. ASSET PREVIEW & SYSTEM IDENTIFIER (Image + ID Block) */}
                              <td className="p-4 px-3 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={proj.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?auto=format&fit=crop&w=200&q=80'}
                                    alt={proj.title}
                                    className="w-[50px] h-[50px] rounded-lg object-cover border border-[#E5E7EB] shrink-0 shadow-2xs"
                                  />
                                  <div className="flex flex-col items-start gap-0.5">
                                    <span className="px-2 py-0.5 rounded border border-[#CBD5E1] bg-[#F8FAFC] text-[10px] font-mono font-bold text-[#111111] inline-block tracking-wider uppercase shadow-2xs">
                                      PROJ-{proj.id.replace('PRJ-', '').replace('#', '')}
                                    </span>
                                    <span className="text-[11px] font-mono text-[#64748B] block mt-0.5">
                                      Compl. {proj.year || '2026'}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* 3. TITLE & SERVICE CATEGORY (Main Entity Block) */}
                              <td className="p-4 px-3 min-w-[260px]">
                                <div className="flex flex-col items-start gap-0.5">
                                  <div className="text-xs font-sans text-[#111111]">
                                    <span className="text-[#64748B] font-mono text-[11px] uppercase mr-1.5 font-bold">Title:</span>
                                    <span className="font-bold uppercase text-[#111111]">
                                      {proj.title}
                                    </span>
                                  </div>
                                  <div className="text-xs font-sans text-[#64748B]">
                                    <span className="text-[#64748B] font-mono text-[11px] uppercase mr-1.5 font-bold">Service:</span>
                                    <span className="font-mono text-[11px] uppercase text-[#64748B]">
                                      {proj.category ? proj.category.toUpperCase() : 'CONSTRUCTION & REALTY'}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* 4. CLIENT & LOCATION METADATA (Detailed Operational Block) */}
                              <td className="p-4 px-3 min-w-[200px]">
                                <div className="flex flex-col items-start gap-0.5">
                                  <div className="text-xs font-sans text-[#111111]">
                                    <span className="text-[#64748B] font-mono text-[11px] uppercase mr-1.5 font-bold">Client:</span>
                                    <span className="font-bold uppercase text-[#111111]">
                                      {proj.client ? proj.client.toUpperCase() : 'ZEKE REALTY CLIENT'}
                                    </span>
                                  </div>
                                  <div className="text-xs font-sans text-[#64748B]">
                                    <span className="text-[#64748B] font-mono text-[11px] uppercase mr-1.5 font-bold">Loc:</span>
                                    <span className="font-mono text-[11px] uppercase text-[#64748B]">
                                      {proj.location ? proj.location.toUpperCase() : 'METRO MANILA'}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* 5. STATUS BADGE (Operational Status) */}
                              <td className="p-4 px-3 text-center whitespace-nowrap">
                                <span
                                  className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded-full inline-block ${getPortfolioStatusBadge(
                                    proj.status
                                  )}`}
                                >
                                  {proj.status}
                                </span>
                              </td>

                              {/* 6. OPERATION DISPATCH (Icon Action Group) */}
                              <td className="p-4 px-3 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  <ActionIconButton
                                    icon={<Eye className="w-4 h-4" />}
                                    tooltip="View Specs"
                                    onClick={() => setInspectingProject(proj)}
                                  />
                                  <ActionIconButton
                                    icon={<ExternalLink className="w-4 h-4" />}
                                    tooltip="Open Web Page"
                                    variant="blue"
                                    onClick={() => window.open(proj.liveUrl || 'https://zekedevelopment.com', '_blank')}
                                  />
                                  <ActionIconButton
                                    icon={<Pencil className="w-4 h-4" />}
                                    tooltip="Edit Record"
                                    variant="amber"
                                    onClick={() => setEditingProject(proj)}
                                  />
                                  <ActionIconButton
                                    icon={<Trash2 className="w-4 h-4" />}
                                    tooltip="Delete Entry"
                                    variant="danger"
                                    onClick={() => handleSingleDeleteProject(proj)}
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls Bar */}
                {(() => {
                  const filtered = portfolioList.filter((proj) => {
                    const matchesSearch =
                      proj.title.toLowerCase().includes(portfolioSearch.toLowerCase()) ||
                      proj.designatedCategory.toLowerCase().includes(portfolioSearch.toLowerCase()) ||
                      proj.clientLocation.toLowerCase().includes(portfolioSearch.toLowerCase());
                    const matchesStatus =
                      portfolioStatusFilter === 'All' || proj.status === portfolioStatusFilter;
                    const combinedCat = `${proj.category || ''} ${proj.designatedCategory || ''}`.toLowerCase();
                    const filterLower = portfolioCategoryFilter.toLowerCase();
                    let matchesCategory = false;
                    if (portfolioCategoryFilter === 'All') {
                      matchesCategory = true;
                    } else if (filterLower.includes('residential')) {
                      matchesCategory = combinedCat.includes('residential');
                    } else if (filterLower.includes('commercial')) {
                      matchesCategory = combinedCat.includes('commercial');
                    } else if (filterLower.includes('planning')) {
                      matchesCategory = combinedCat.includes('planning') || combinedCat.includes('design');
                    } else if (filterLower.includes('renovation') || filterLower.includes('retrofitting')) {
                      matchesCategory = combinedCat.includes('renovation') || combinedCat.includes('retrofitting');
                    } else if (filterLower.includes('interior')) {
                      matchesCategory = combinedCat.includes('interior');
                    } else if (filterLower.includes('waterproofing')) {
                      matchesCategory = combinedCat.includes('waterproofing');
                    } else if (filterLower.includes('gate') || filterLower.includes('fence')) {
                      matchesCategory = combinedCat.includes('gate') || combinedCat.includes('fence');
                    } else if (filterLower.includes('addition') || filterLower.includes('extension')) {
                      matchesCategory = combinedCat.includes('addition') || combinedCat.includes('extension');
                    } else if (filterLower.includes('land')) {
                      matchesCategory = combinedCat.includes('land') || combinedCat.includes('development');
                    } else {
                      matchesCategory = combinedCat.includes(filterLower);
                    }

                    return matchesSearch && matchesStatus && matchesCategory;
                  });

                  const totalRecords = filtered.length;
                  const totalPages = Math.ceil(totalRecords / portfolioPerPage) || 1;
                  const startItem = totalRecords === 0 ? 0 : (portfolioPage - 1) * portfolioPerPage + 1;
                  const endItem = Math.min(portfolioPage * portfolioPerPage, totalRecords);

                  return (
                    <div className="bg-[#F8FAFC] border-t border-[#E5E7EB] px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#64748B]">
                      <div>Showing {startItem}-{endItem} of {totalRecords} records</div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <span>Items per page:</span>
                          <div className="relative inline-block">
                            <select
                              value={portfolioPerPage}
                              onChange={(e) => {
                                setPortfolioPerPage(Number(e.target.value));
                                setPortfolioPage(1);
                              }}
                              className="appearance-none pl-2.5 pr-7 py-1 bg-white border border-[#CBD5E1] rounded text-xs text-[#1E293B] cursor-pointer focus:outline-none focus:border-[#C8102E]"
                            >
                              <option value={5}>5</option>
                              <option value={10}>10</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={portfolioPage === 1}
                            onClick={() => setPortfolioPage((p) => Math.max(1, p - 1))}
                            className="p-1 rounded border border-[#CBD5E1] bg-white text-[#1E293B] disabled:opacity-40"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="px-2 font-bold text-[#1E293B]">
                            Page {portfolioPage} of {totalPages}
                          </span>
                          <button
                            type="button"
                            disabled={portfolioPage >= totalPages}
                            onClick={() => setPortfolioPage((p) => Math.min(totalPages, p + 1))}
                            className="p-1 rounded border border-[#CBD5E1] bg-white text-[#1E293B] disabled:opacity-40"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Edit Portfolio Information Overlay Editor Modal */}
              {editingProject && (
                <EditPortfolioModal
                  project={editingProject as PortfolioEditingProject}
                  onClose={() => setEditingProject(null)}
                  onSave={(updatedProject) => {
                    setPortfolioList((prev) =>
                      prev.map((item) => (item.id === updatedProject.id ? { ...item, ...updatedProject } : item))
                    );
                    setInspectingProject((prev) => (prev && prev.id === updatedProject.id ? { ...prev, ...updatedProject } : prev));
                    setEditingProject(null);
                    setToast({
                      show: true,
                      message: `SUCCESS: Portfolio Asset record [${updatedProject.id}] committed and updated.`,
                      type: 'success',
                    });
                  }}
                />
              )}
            </div>
            )
          )}

          {/* ==================== 4. ARCHIVE / TRASH MANAGER TAB ==================== */}
          {activeTab === 'trash' && (
            <div className="space-y-5">
              {/* Header Title Bar */}
              <div className="pb-5 border-b border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-black text-2xl md:text-3xl text-[#1E293B] uppercase tracking-tight">ARCHIVE / TRASH MANAGER</h2>
                  <p className="font-sans text-sm md:text-base text-[#64748B] mt-1">Review soft-deleted records, manage restorations, or purge permanent entities.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={selectedVaultIds.length === 0}
                    onClick={handleBulkRestoreVault}
                    className="px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold uppercase rounded-lg hover:bg-emerald-100 disabled:opacity-40 cursor-pointer"
                  >
                    Restore Selected ({selectedVaultIds.length})
                  </button>
                  <button
                    type="button"
                    disabled={selectedVaultIds.length === 0}
                    onClick={handleBulkPermanentDeleteVault}
                    className="px-3 py-2 bg-red-50 text-[#C8102E] border border-red-200 text-xs font-mono font-bold uppercase rounded-lg hover:bg-red-100 disabled:opacity-40 cursor-pointer"
                  >
                    Purge Selected ({selectedVaultIds.length})
                  </button>
                </div>
              </div>

              {/* Unified Data Table & Controls Container */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
                {/* Search Header Bar */}
                <div className="p-4 border-b border-[#E5E7EB] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                    <div className="relative flex-1 max-w-2xl">
                      <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={vaultSearch}
                        onChange={(e) => {
                          setVaultSearch(e.target.value);
                          setVaultPage(1);
                        }}
                        placeholder="Search archived records..."
                        className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-mono text-[#1E293B] placeholder-[#94A3B8] rounded-lg focus:outline-none focus:border-[#C8102E]"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans min-w-[850px]">
                    <thead className="bg-[#FFFFFF] text-[#64748B] font-mono text-[10px] uppercase tracking-wider border-b border-[#E5E7EB]">
                      <tr className="divide-x divide-[#E5E7EB]">
                        <th className="p-3.5 w-10 text-center bg-[#FFFFFF] sticky left-0 z-10 border-r border-[#E5E7EB] border-l-4 border-l-transparent">
                          <input
                            type="checkbox"
                            checked={
                              vaultList.length > 0 &&
                              vaultList.every((item) => selectedVaultIds.includes(item.id))
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedVaultIds(vaultList.map((item) => item.id));
                              } else {
                                setSelectedVaultIds([]);
                              }
                            }}
                            className="w-4 h-4 accent-[#C8102E] cursor-pointer rounded"
                          />
                        </th>
                        <th className="p-3.5 font-bold">Stamp ID</th>
                        <th className="p-3.5 font-bold">Registry Entity Details</th>
                        <th className="p-3.5 font-bold text-center">
                          Protocol Dispatch
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] text-[#1E293B]">
                      {(() => {
                        const filtered = vaultList.filter((item) => {
                          return (
                            item.entityDetails.toLowerCase().includes(vaultSearch.toLowerCase()) ||
                            item.stampId.toLowerCase().includes(vaultSearch.toLowerCase())
                          );
                        });

                        const startIndex = (vaultPage - 1) * vaultPerPage;
                        const paginated = filtered.slice(startIndex, startIndex + vaultPerPage);

                        if (paginated.length === 0) {
                          return (
                            <tr>
                              <td colSpan={4} className="p-10 text-center text-[#94A3B8] font-mono text-xs">
                                Trash vault is currently empty.
                              </td>
                            </tr>
                          );
                        }

                        return paginated.map((item) => {
                          const isSelected = selectedVaultIds.includes(item.id);

                          return (
                            <tr
                              key={item.id}
                              className={`transition-colors duration-150 divide-x divide-[#E5E7EB] ${
                                isSelected ? 'bg-red-50/70' : 'hover:bg-[#F8FAFC]'
                              }`}
                            >
                              <td className={`p-3.5 text-center sticky left-0 z-10 border-r border-[#E5E7EB] border-l-4 transition-colors ${isSelected ? 'bg-red-50/90 border-l-[#C8102E]' : 'bg-white border-l-transparent'}`}>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedVaultIds((prev) => [...prev, item.id]);
                                    } else {
                                      setSelectedVaultIds((prev) =>
                                        prev.filter((id) => id !== item.id)
                                      );
                                    }
                                  }}
                                  className="w-4 h-4 accent-[#C8102E] cursor-pointer rounded"
                                />
                              </td>

                              <td className="p-3.5 font-mono text-xs text-[#C8102E] font-bold whitespace-nowrap">
                                {item.stampId}
                              </td>

                              <td className="p-3.5 font-bold text-[#1E293B]">
                                {item.entityDetails}
                              </td>

                              <td className="p-3.5 text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1.5">
                                  <ActionIconButton
                                    icon={<RotateCcw className="w-4 h-4" />}
                                    tooltip="Restore Record"
                                    variant="success"
                                    onClick={() => handleRestoreVaultItem(item)}
                                  />
                                  <ActionIconButton
                                    icon={<XCircle className="w-4 h-4" />}
                                    tooltip="Permanent Delete"
                                    variant="danger"
                                    onClick={() => handlePermanentDeleteVaultItem(item.id)}
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls Bar */}
                {(() => {
                  const filtered = vaultList.filter((item) => {
                    return (
                      item.entityDetails.toLowerCase().includes(vaultSearch.toLowerCase()) ||
                      item.stampId.toLowerCase().includes(vaultSearch.toLowerCase())
                    );
                  });

                  const totalRecords = filtered.length;
                  const totalPages = Math.ceil(totalRecords / vaultPerPage) || 1;
                  const startItem = totalRecords === 0 ? 0 : (vaultPage - 1) * vaultPerPage + 1;
                  const endItem = Math.min(vaultPage * vaultPerPage, totalRecords);

                  return (
                    <div className="bg-[#F8FAFC] border-t border-[#E5E7EB] px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#64748B]">
                      <div>Showing {startItem}-{endItem} of {totalRecords} records</div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <span>Items per page:</span>
                          <select
                            value={vaultPerPage}
                            onChange={(e) => {
                              setVaultPerPage(Number(e.target.value));
                              setVaultPage(1);
                            }}
                            className="bg-white border border-[#CBD5E1] rounded px-2 py-1 text-xs text-[#1E293B]"
                          >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={vaultPage === 1}
                            onClick={() => setVaultPage((p) => Math.max(1, p - 1))}
                            className="p-1 rounded border border-[#CBD5E1] bg-white text-[#1E293B] disabled:opacity-40"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="px-2 font-bold text-[#1E293B]">
                            Page {vaultPage} of {totalPages}
                          </span>
                          <button
                            type="button"
                            disabled={vaultPage >= totalPages}
                            onClick={() => setVaultPage((p) => Math.min(totalPages, p + 1))}
                            className="p-1 rounded border border-[#CBD5E1] bg-white text-[#1E293B] disabled:opacity-40"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* ==================== 6. SYSTEM SETTINGS TAB ==================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="pb-5 border-b border-[#E5E7EB]">
                <div>
                  <h2 className="font-display font-black text-2xl md:text-3xl text-[#111111] uppercase tracking-tight">SYSTEM SETTINGS</h2>
                  <p className="font-mono text-sm text-[#64748B] uppercase tracking-wider mt-1">MANAGE ADMINISTRATIVE PREFERENCES, SECURITY PROTOCOLS, AND OPERATIONAL BRANDING.</p>
                </div>
              </div>

              {/* Main Layout: Equal 2-Column Split Card Grid (responsive 50/50 split on desktop, stacking into a single column on mobile) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                
                {/* LEFT COLUMN CARD: "CHANGE PASSWORD" */}
                <div className="bg-white p-6 md:p-7 rounded-xl border border-[#E5E7EB] shadow-sm space-y-6 flex flex-col justify-between">
                  <div>
                    {/* Card Header */}
                    <div className="pb-4 border-b border-[#F1F5F9] space-y-1">
                      <h3 className="font-display font-black text-lg text-[#111111] uppercase tracking-tight">
                        CHANGE PASSWORD
                      </h3>
                      <p className="font-mono text-xs text-[#64748B] uppercase tracking-wider pt-1">
                        CONFIGURE ADMINISTRATIVE CREDENTIALS AND SECURITY ACCESS.
                      </p>
                    </div>

                    {/* Form Fields */}
                    <form id="password-settings-form" onSubmit={handleSavePassword} className="mt-6 space-y-5">
                      
                      {/* Field 1: Retype Old Password * */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider">
                          Retype Old Password <span className="text-[#C8102E]">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showOldPassword ? "text" : "password"}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full p-3 pr-10 bg-white border border-[#D1D5DB] rounded-lg text-sm text-[#111111] font-sans placeholder:text-slate-400 focus:outline-none focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E] transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#111111] transition-colors p-1 cursor-pointer"
                          >
                            {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Field 2: Type New Password * */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider">
                            Type New Password <span className="text-[#FF5500]">*</span>
                          </label>
                          {newPassword.length > 0 && (
                            <span
                              className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                newPassword.length >= 6
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-orange-50 text-[#FF5500] border border-orange-200'
                              }`}
                            >
                              {newPassword.length >= 6 ? '✓ Minimum 6 chars met' : 'Min 6 characters'}
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Minimum 6 characters"
                            className={`w-full p-3 pr-10 bg-white border rounded-lg text-sm text-[#111111] font-sans placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-all ${
                              newPassword.length > 0 && newPassword.length < 6
                                ? 'border-orange-300 focus:border-[#FF5500] focus:ring-[#FF5500]'
                                : 'border-[#D1D5DB] focus:border-[#003399] focus:ring-[#003399]'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#111111] transition-colors p-1 cursor-pointer"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Field 3: Retype New Password * */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider">
                            Retype New Password <span className="text-[#FF5500]">*</span>
                          </label>
                          {confirmPassword.length > 0 && (
                            <span
                              className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                confirmPassword === newPassword && newPassword.length >= 6
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-orange-50 text-[#FF5500] border border-orange-200'
                              }`}
                            >
                              {confirmPassword === newPassword
                                ? '✓ Passwords match'
                                : 'Passwords do not match'}
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className={`w-full p-3 pr-10 bg-white border rounded-lg text-sm text-[#111111] font-sans placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-all ${
                              confirmPassword.length > 0 && confirmPassword !== newPassword
                                ? 'border-orange-300 focus:border-[#FF5500] focus:ring-[#FF5500]'
                                : 'border-[#D1D5DB] focus:border-[#003399] focus:ring-[#003399]'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#111111] transition-colors p-1 cursor-pointer"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                    </form>
                  </div>

                  {/* Card Action Button (Bottom Left) */}
                  <div className="pt-6 border-t border-[#F1F5F9] flex justify-start">
                    <button
                      type="submit"
                      form="password-settings-form"
                      className="bg-[#003399] hover:bg-[#FF5500] text-white font-display font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      <span>SAVE PASSWORD</span>
                    </button>
                  </div>
                </div>

                {/* RIGHT COLUMN CARD: "SOCIAL MEDIA INTEGRATION" */}
                <div className="bg-white p-6 md:p-7 rounded-xl border border-[#E5E7EB] shadow-sm space-y-6 flex flex-col justify-between">
                  <div>
                    {/* Card Header */}
                    <div className="pb-4 border-b border-[#F1F5F9] space-y-1">
                      <h3 className="font-display font-black text-lg text-[#111111] uppercase tracking-tight">
                        SOCIAL MEDIA INTEGRATION
                      </h3>
                      <p className="font-mono text-xs text-[#64748B] uppercase tracking-wider pt-1">
                        MANAGE EXTERNAL LINKS FOR FACEBOOK, INSTAGRAM, AND TIKTOK.
                      </p>
                    </div>

                    {/* Form Fields */}
                    <form id="social-settings-form" onSubmit={handleSaveSocial} className="mt-6 space-y-5">
                      
                      {/* Field 1: Facebook URL */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider">
                          Facebook URL
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={facebookUrl}
                            onChange={(e) => setFacebookUrl(e.target.value)}
                            placeholder="https://web.facebook.com/zekerealtyconstructiondevelopment"
                            className="w-full p-3 bg-white border border-[#D1D5DB] rounded-lg text-sm text-[#111111] font-sans placeholder:text-slate-400 focus:outline-none focus:border-[#003399] focus:ring-1 focus:ring-[#003399] transition-all"
                          />
                        </div>
                      </div>

                      {/* Field 2: Instagram URL */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider">
                          Instagram URL
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={instagramUrl}
                            onChange={(e) => setInstagramUrl(e.target.value)}
                            placeholder="https://instagram.com/zekerealty"
                            className="w-full p-3 bg-white border border-[#D1D5DB] rounded-lg text-sm text-[#111111] font-sans placeholder:text-slate-400 focus:outline-none focus:border-[#003399] focus:ring-1 focus:ring-[#003399] transition-all"
                          />
                        </div>
                      </div>

                      {/* Field 3: TikTok URL */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider">
                          TikTok URL
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={tiktokUrl}
                            onChange={(e) => setTiktokUrl(e.target.value)}
                            placeholder="https://tiktok.com/@zekerealty"
                            className="w-full p-3 bg-white border border-[#D1D5DB] rounded-lg text-sm text-[#111111] font-sans placeholder:text-slate-400 focus:outline-none focus:border-[#003399] focus:ring-1 focus:ring-[#003399] transition-all"
                          />
                        </div>
                      </div>

                    </form>
                  </div>

                  {/* Card Action Button (Bottom Left) */}
                  <div className="pt-6 border-t border-[#F1F5F9] flex justify-start">
                    <button
                      type="submit"
                      form="social-settings-form"
                      className="bg-[#111111] hover:bg-black text-white font-display font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Globe className="w-4 h-4 text-emerald-400" />
                      <span>SAVE SOCIAL INTEGRATION</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}


        </main>


      </div>

      {/* CREATE PORTFOLIO PROJECT MODAL */}
      {showAddProjectModal && (
        <AddPortfolioModal
          onClose={() => setShowAddProjectModal(false)}
          onSave={(newProj) => {
            setPortfolioList((prev) => {
              if (prev.some((p) => p.id === newProj.id || (p.title === newProj.title && p.client === newProj.client))) {
                return prev;
              }
              return [newProj, ...prev];
            });
            setShowAddProjectModal(false);
            setToast({
              show: true,
              message: `NEW PORTFOLIO PROJECT "${newProj.title.toUpperCase()}" PUBLISHED SUCCESSFULLY`,
              type: 'success'
            });
          }}
        />
      )}

      {/* 1. CONFIRMATION WIDGET POPUP */}
      {pendingConfirmation && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-2xl max-w-md w-full text-left relative overflow-hidden">
            {/* Top Dark Header Banner */}
            <div className={`px-5 py-4 sm:px-6 sm:py-5 relative ${
              pendingConfirmation.theme === 'danger'
                ? 'bg-[#111111] text-white'
                : 'bg-[#0E1A14] text-white'
            }`}>
              {/* Category / Eyebrow Text */}
              <div className="mb-1">
                <span className={`font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] ${
                  pendingConfirmation.theme === 'danger'
                    ? 'text-[#FF5500]'
                    : 'text-amber-400'
                }`}>
                  {pendingConfirmation.theme === 'danger' ? 'DATABASE ARCHIVE PORTAL' : 'DATABASE RECOVERY PORTAL'}
                </span>
              </div>

              {/* Main Header Title */}
              <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-white">
                {pendingConfirmation.title}
              </h3>

              {/* Accent Separator Line (Gold for recovery / Brand Accent Orange for danger) */}
              <div className={`h-1 w-full absolute bottom-0 left-0 right-0 ${
                pendingConfirmation.theme === 'danger'
                  ? 'bg-[#FF5500]'
                  : 'bg-amber-400'
              }`} />
            </div>

            {/* Light Content Body */}
            <div className="p-5 sm:p-6 bg-white text-zinc-900">
              <p className="font-body text-xs sm:text-sm text-zinc-700 leading-relaxed font-medium">
                {pendingConfirmation.details}
              </p>
            </div>

            {/* Footer Action Bar */}
            <div className="px-5 py-3.5 sm:px-6 sm:py-4 bg-zinc-50 border-t border-zinc-200/80 flex items-center justify-end gap-2.5 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setPendingConfirmation(null)}
                className="px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-300 font-mono text-xs font-bold uppercase tracking-wider text-zinc-700 transition-all cursor-pointer shadow-xs"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={executeConfirmedAction}
                className={`px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-2 ${
                  pendingConfirmation.theme === 'danger'
                    ? 'bg-[#FF5500] hover:bg-[#E04B00]'
                    : 'bg-[#0E1A14] hover:bg-black text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {pendingConfirmation.theme === 'danger' ? (
                  <Trash2 className="w-3.5 h-3.5" />
                ) : (
                  <RotateCcw className="w-3.5 h-3.5" />
                )}
                <span>{pendingConfirmation.confirmText.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. POST-CONFIRMATION SUCCESS POPUP */}
      {actionSuccessResult && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-2xl max-w-md w-full text-left relative overflow-hidden">
            {/* Top Dark Header Banner */}
            <div className="px-5 py-4 sm:px-6 sm:py-5 bg-[#0E1A14] text-white relative">
              <div className="mb-1">
                <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                  SYSTEM CONFIRMATION
                </span>
              </div>

              <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{actionSuccessResult.title}</span>
              </h3>

              {/* Accent Separator Line */}
              <div className="h-1 w-full absolute bottom-0 left-0 right-0 bg-emerald-500" />
            </div>

            {/* Light Content Body */}
            <div className="p-5 sm:p-6 bg-white text-zinc-900">
              <p className="font-body text-xs sm:text-sm text-zinc-700 leading-relaxed font-medium">
                {actionSuccessResult.details}
              </p>
            </div>

            {/* Footer Action Bar */}
            <div className="px-5 py-3.5 sm:px-6 sm:py-4 bg-zinc-50 border-t border-zinc-200/80 flex items-center justify-end rounded-b-2xl">
              <button
                type="button"
                onClick={() => setActionSuccessResult(null)}
                className="px-5 py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                DISMISS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Feedback Notification */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-xs font-mono tracking-wide transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
          toast.type === 'success'
            ? 'bg-[#111111] text-white border-emerald-500/60'
            : toast.type === 'error'
            ? 'bg-[#111111] text-white border-red-500/60'
            : 'bg-[#111111] text-white border-blue-500/60'
        }`}>
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
          {toast.type === 'info' && <Bell className="w-5 h-5 text-blue-400 shrink-0" />}
          <div>
            <p className="font-bold uppercase tracking-wider text-slate-100">{toast.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setToast((prev) => ({ ...prev, show: false }))}
            className="ml-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
