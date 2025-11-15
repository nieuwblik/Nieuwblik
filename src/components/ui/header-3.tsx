'use client';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { createPortal } from 'react-dom';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { LucideIcon } from 'lucide-react';
import {
	CodeIcon,
	GlobeIcon,
	Users,
	FileText,
	Briefcase,
	Mail,
	BookOpen,
	Home,
} from 'lucide-react';
import logo from '@/assets/logo.png';

type LinkItem = {
	title: string;
	href: string;
	icon: LucideIcon;
	description?: string;
};

export function Header() {
	const [open, setOpen] = React.useState(false);
	const scrolled = useScroll(10);

	React.useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	return (
		<header
			className={cn('sticky top-0 z-50 w-full border-b border-transparent', {
				'bg-background/95 supports-[backdrop-filter]:bg-background/50 border-border backdrop-blur-lg':
					scrolled,
			})}
		>
			<nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-6">
				<div className="flex items-center gap-5">
					<Link to="/" className="hover:bg-accent rounded-md p-2">
						<img 
							src={logo} 
							alt="Nieuwblik" 
							width="160"
							height="40"
							className="h-6 brightness-0"
						/>
					</Link>
					<NavigationMenu className="hidden md:flex">
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuTrigger className="bg-transparent">Diensten</NavigationMenuTrigger>
								<NavigationMenuContent className="bg-background p-1 pr-1.5">
									<ul className="bg-popover grid w-[400px] gap-2 rounded-md border p-2 shadow">
										{dienstenLinks.map((item, i) => (
											<li key={i}>
												<ListItem {...item} />
											</li>
										))}
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink className="px-4" asChild>
									<Link to="/portfolio" className="hover:bg-accent rounded-md p-2">
										Portfolio
									</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink className="px-4" asChild>
									<Link to="/blog" className="hover:bg-accent rounded-md p-2">
										Blog
									</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink className="px-4" asChild>
									<Link to="/over-ons" className="hover:bg-accent rounded-md p-2">
										Over Ons
									</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>
				<div className="hidden items-center gap-2 md:flex">
					<Button asChild>
						<Link to="/contact">Start je Project</Link>
					</Button>
				</div>
				<Button
					size="icon"
					variant="outline"
					onClick={() => setOpen(!open)}
					className="md:hidden"
					aria-expanded={open}
					aria-controls="mobile-menu"
					aria-label="Toggle menu"
				>
					<MenuToggleIcon open={open} className="size-5" duration={300} />
				</Button>
			</nav>
			<MobileMenu open={open} className="flex flex-col justify-between gap-2 overflow-y-auto">
				<NavigationMenu className="max-w-full">
					<div className="flex w-full flex-col gap-y-2">
						<NavigationMenuLink asChild>
							<Link 
								to="/" 
								onClick={() => setOpen(false)}
								className="flex p-2 hover:bg-accent flex-row rounded-md items-center gap-x-2"
							>
								<Home className="text-foreground size-4" />
								<span className="font-medium">Home</span>
							</Link>
						</NavigationMenuLink>
						<span className="text-sm mt-2">Diensten</span>
						{dienstenLinks.map((link) => (
							<div key={link.title} onClick={() => setOpen(false)}>
								<ListItem {...link} />
							</div>
						))}
						<NavigationMenuLink asChild>
							<Link 
								to="/portfolio" 
								onClick={() => setOpen(false)}
								className="flex p-2 hover:bg-accent flex-row rounded-md items-center gap-x-2 mt-2"
							>
								<Briefcase className="text-foreground size-4" />
								<span className="font-medium">Portfolio</span>
							</Link>
						</NavigationMenuLink>
						<NavigationMenuLink asChild>
							<Link 
								to="/blog" 
								onClick={() => setOpen(false)}
								className="flex p-2 hover:bg-accent flex-row rounded-md items-center gap-x-2"
							>
								<BookOpen className="text-foreground size-4" />
								<span className="font-medium">Blog</span>
							</Link>
						</NavigationMenuLink>
						<NavigationMenuLink asChild>
							<Link 
								to="/over-ons" 
								onClick={() => setOpen(false)}
								className="flex p-2 hover:bg-accent flex-row rounded-md items-center gap-x-2"
							>
								<Users className="text-foreground size-4" />
								<span className="font-medium">Over Ons</span>
							</Link>
						</NavigationMenuLink>
					</div>
				</NavigationMenu>
				<div className="flex flex-col gap-2">
					<Button asChild className="w-full" onClick={() => setOpen(false)}>
						<Link to="/contact">Start je Project</Link>
					</Button>
				</div>
			</MobileMenu>
		</header>
	);
}

type MobileMenuProps = React.ComponentProps<'div'> & {
	open: boolean;
};

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
	if (!open || typeof window === 'undefined') return null;

	return createPortal(
		<div
			id="mobile-menu"
			className={cn(
				'bg-background/95 supports-[backdrop-filter]:bg-background/50 backdrop-blur-lg',
				'fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y md:hidden',
			)}
		>
			<div
				data-slot={open ? 'open' : 'closed'}
				className={cn(
					'data-[slot=open]:animate-in data-[slot=open]:zoom-in-97 ease-out',
					'size-full p-4',
					className,
				)}
				{...props}
			>
				{children}
			</div>
		</div>,
		document.body,
	);
}

function ListItem({
	title,
	description,
	icon: Icon,
	className,
	href,
	...props
}: React.ComponentProps<typeof NavigationMenuLink> & LinkItem) {
	return (
		<NavigationMenuLink className={cn('w-full flex flex-row gap-x-2 data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground rounded-sm p-2', className)} {...props} asChild>
			<Link to={href}>
				<div className="bg-background/40 flex aspect-square size-12 items-center justify-center rounded-md border shadow-sm">
					<Icon className="text-foreground size-5" />
				</div>
				<div className="flex flex-col items-start justify-center">
					<span className="font-medium">{title}</span>
					<span className="text-muted-foreground text-xs">{description}</span>
				</div>
			</Link>
		</NavigationMenuLink>
	);
}

const dienstenLinks: LinkItem[] = [
	{
		title: 'Website Ontwikkeling',
		href: '/diensten#websites',
		description: 'Professionele websites op maat',
		icon: GlobeIcon,
	},
	{
		title: 'Webshops',
		href: '/diensten#webshops',
		description: 'E-commerce oplossingen voor jouw business',
		icon: CodeIcon,
	},
	{
		title: 'SEO Optimalisatie',
		href: '/diensten#seo',
		description: 'Vergroot je online zichtbaarheid',
		icon: FileText,
	},
];

function useScroll(threshold: number) {
	const [scrolled, setScrolled] = React.useState(false);

	const onScroll = React.useCallback(() => {
		setScrolled(window.scrollY > threshold);
	}, [threshold]);

	React.useEffect(() => {
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	}, [onScroll]);

	React.useEffect(() => {
		onScroll();
	}, [onScroll]);

	return scrolled;
}
