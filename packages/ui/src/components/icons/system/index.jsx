import React from "react";
import { Search, Compass, User, Settings, Bell, Heart, PenLine, LayoutDashboard, Library, Clock, Globe, MessageCircle, ChevronRight, ChevronDown, ArrowRight, ArrowLeft, Plus, X, Check, MoreHorizontal, ExternalLink, Menu, FileText, FolderOpen, Image, Upload, Download, Undo2, Redo2, List, ListOrdered, Quote, Code2, Link2, ImageIcon as LucideImageIcon, Languages, } from "lucide-react";
import { cn } from "../../../lib/utils";
import { iconVariants } from "../icon";
function wrap(Component, label) {
    function Wrapped({ size, color, className, ...props }) {
        return (<Component className={cn(iconVariants({ size, color }), className)} strokeWidth={1.75} aria-label={label} aria-hidden={!label} role="img" {...props}/>);
    }
    Wrapped.displayName = label;
    return Wrapped;
}
export const SearchIcon = wrap(Search, "Search");
export const ExploreIcon = wrap(Compass, "Explore");
export const ProfileIcon = wrap(User, "Profile");
export const SettingsIcon = wrap(Settings, "Settings");
export const NotificationIcon = wrap(Bell, "Notifications");
export const SupportIcon = wrap(Heart, "Support");
export const EditorIcon = wrap(PenLine, "Editor");
export const StudioIcon = wrap(LayoutDashboard, "Studio");
export const DashboardIcon = wrap(LayoutDashboard, "Dashboard");
export const LibraryIcon = wrap(Library, "Library");
export const TimelineIcon = wrap(Clock, "Timeline");
export const GlobeIcon = wrap(Globe, "Globe");
export const ChatIcon = wrap(MessageCircle, "Chat");
export const ChevronRightIcon = wrap(ChevronRight, "Chevron Right");
export const ChevronDownIcon = wrap(ChevronDown, "Chevron Down");
export const ArrowRightIcon = wrap(ArrowRight, "Arrow Right");
export const ArrowLeftIcon = wrap(ArrowLeft, "Arrow Left");
export const PlusIcon = wrap(Plus, "Plus");
export const CloseIcon = wrap(X, "Close");
export const CheckIcon = wrap(Check, "Check");
export const MenuIcon = wrap(Menu, "Menu");
export const MoreIcon = wrap(MoreHorizontal, "More");
export const ExternalLinkIcon = wrap(ExternalLink, "External Link");
export const FileIcon = wrap(FileText, "File");
export const FolderIcon = wrap(FolderOpen, "Folder");
export const ImageIconWrapped = wrap(Image, "Directory Image");
export const UploadIcon = wrap(Upload, "Upload");
export const DownloadIcon = wrap(Download, "Download");
export const UndoIcon = wrap(Undo2, "Undo");
export const RedoIcon = wrap(Redo2, "Redo");
export const BulletListIcon = wrap(List, "Bullet List");
export const OrderedListIcon = wrap(ListOrdered, "Ordered List");
export const QuoteIcon = wrap(Quote, "Quote");
export const CodeIcon = wrap(Code2, "Code");
export const LinkIcon = wrap(Link2, "Link");
export const ImageIcon = wrap(LucideImageIcon, "Image");
export const LanguagesIcon = wrap(Languages, "Languages");
