
Ourteam
import { useEffect, useMemo, useRef, useState } from "react";


// ============================================================
// EDIT TEAM DATA HERE
//
// Add photos in public/team/ and use paths like:
// img: "/team/member-01.jpg"
//
// Valid roles only:
// "Convenor" | "Co-Convenor" | "Developer" | "Core Member"
// ============================================================
const TEAM = [
    {
        name: "Vedant Chaware",
        role: "Convenor",
        skills: [],
        img: "/team/convenor.png",
        bio: "Leading the Srijan 2026 mission with vision, strategy, and championship-level execution.",
        linkedin: "https://linkedin.com",
        github: "",
        instagram: "https://instagram.com",
    },
    {
        name: "Gayatri Phale",
        role: "Co-Convenor",
        skills: [],
        img: "/team/coconvenor.png",
        bio: "Driving coordination, momentum, and team operations across every Srijan 2026 event.",
        linkedin: "https://linkedin.com",
        github: "",
        instagram: "https://instagram.com",
    },
    {
        name: "Member",
        role: "Developer",
        skills: ["React", "Node", "MongoDB", "Frontend"],
        img: "/team/.jpeg",
        bio: "Building fast, reliable, and high-impact technical experiences for Srijan 2026.",
        linkedin: "https://linkedin.com",
        github: "https://github.com",
        instagram: "",
    },
    {
        name: "Tejas",
        role: "Developer",
        skills: ["React.js", "APIs", "Database", "Backend"],
        img: "/team/Member.jpeg",
        bio: "Engineering the systems, dashboards, and event platforms behind the festival.",
        linkedin: "https://linkedin.com",
        github: "https://github.com",
        instagram: "",
    },


    {
        name: "Member Name 07",
        role: "Core Member",
        skills: [],
        img: "",
        bio: "Supporting planning, participation, and seamless execution across all event arenas.",
        linkedin: "https://linkedin.com",
        github: "",
        instagram: "https://instagram.com",
    },
    {
        name: "Member Name 08",
        role: "Core Member",
        skills: [],
        img: "",
        bio: "Helping make every Srijan event more organized, exciting, and memorable.",
        linkedin: "https://linkedin.com",
        github: "",
        instagram: "https://instagram.com",
    },
    {
        name: "Member Name 09",
        role: "Core Member",
        skills: [],
        img: "",
        bio: "Coordinating people, ideas, and event operations with energy and precision.",
        linkedin: "",
        github: "",
        instagram: "https://instagram.com",
    },
    {
        name: "Member Name 10",
        role: "Core Member",
        skills: [],
        img: "",
        bio: "Working behind the scenes to turn every challenge into a successful event.",
        linkedin: "https://linkedin.com",
        github: "",
        instagram: "",
    },



];


const ROLE_ORDER = ["Convenor", "Co-Convenor", "Developer", "Core Member"];


const FILTERS = [
    { id: "all", label: "ALL" },
    { id: "convenors", label: "CONVENORS" },
    { id: "developers", label: "DEVELOPERS" },
    { id: "core", label: "CORE MEMBERS" },
];


const EVENTS = [
    "HACKATHON",
    "KBC QUIZ",
    "PCB DESIGNING",
    "CAD MODELING",
    "BRIDGE MAKING",
    "CIRCUIT MAKING",
];


function getInitials(name) {
    return name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}


function getRoleMeta(role) {
    if (role === "Convenor") {
        return {
            icon: "★",
            badge: "CONVENOR",
            initials: "01",
            badgeClass:
                "border-amber-300/60 bg-amber-300/10 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.14)]",
        };
    }


    if (role === "Co-Convenor") {
        return {
            icon: "★",
            badge: "CO-CONVENOR",
            initials: "02",
            badgeClass:
                "border-orange-300/60 bg-orange-300/10 text-orange-200 shadow-[0_0_20px_rgba(251,146,60,0.14)]",
        };
    }


    if (role === "Developer") {
        return {
            icon: "</>",
            badge: "DEVELOPER",
            initials: "03",
            badgeClass:
                "border-sky-300/60 bg-sky-300/10 text-sky-200 shadow-[0_0_20px_rgba(56,189,248,0.14)]",
        };
    }


    return {
        icon: "⬡",
        badge: "CORE MEMBER",
        initials: "04",
        badgeClass:
            "border-sky-200/40 bg-sky-200/[0.08] text-sky-100 shadow-[0_0_20px_rgba(125,211,252,0.1)]",
    };
}


function useCountUp(target) {
    const [count, setCount] = useState(0);
    const elementRef = useRef(null);
    const completedRef = useRef(false);


    useEffect(() => {
        const element = elementRef.current;


        if (!element) return undefined;


        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting || completedRef.current) return;


                completedRef.current = true;


                const duration = 1100;
                const startTime = performance.now();


                const animate = (time) => {
                    const progress = Math.min((time - startTime) / duration, 1);
                    const easeOut = 1 - Math.pow(1 - progress, 4);


                    setCount(Math.floor(target * easeOut));


                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        setCount(target);
                    }
                };


                requestAnimationFrame(animate);
            },
            { threshold: 0.4 }
        );


        observer.observe(element);


        return () => observer.disconnect();
    }, [target]);


    return [elementRef, count];
}


function SocialButton({ href, type, name }) {
    if (!href) return null;


    const labels = {
        linkedin: "in",
        github: "GH",
        instagram: "IG",
    };


    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${name} ${type}`}
            className="grid h-9 min-w-9 place-items-center border border-white/20 bg-[#081323]/95 px-2 text-[10px] font-black text-slate-100 transition hover:border-sky-300 hover:bg-sky-300 hover:text-[#05080f] [clip-path:polygon(16%_0,100%_0,84%_100%,0_100%)]"
        >
            {labels[type]}
        </a>
    );
}


function PlayerCard({ member, index, cardWidthClass = "" }) {
    const cardRef = useRef(null);
    const [isTouch, setIsTouch] = useState(false);
    const [flipped, setFlipped] = useState(false);


    const roleMeta = getRoleMeta(member.role);
    const isLeader =
        member.role === "Convenor" || member.role === "Co-Convenor";


    useEffect(() => {
        const query = window.matchMedia("(hover: none), (pointer: coarse)");


        const updateTouchMode = () => {
            setIsTouch(query.matches);
        };


        updateTouchMode();
        query.addEventListener("change", updateTouchMode);


        return () => query.removeEventListener("change", updateTouchMode);
    }, []);


    const handleMouseMove = (event) => {
        if (isTouch || !cardRef.current) return;


        const card = cardRef.current;
        const rect = card.getBoundingClientRect();


        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;


        const rotateX = ((y - rect.height / 2) / rect.height) * -6;
        const rotateY = ((x - rect.width / 2) / rect.width) * 6;


        card.style.setProperty("--tilt-x", `${rotateX}deg`);
        card.style.setProperty("--tilt-y", `${rotateY}deg`);
        card.style.setProperty("--glow-x", `${x}px`);
        card.style.setProperty("--glow-y", `${y}px`);
    };


    const resetTilt = () => {
        if (!cardRef.current) return;


        cardRef.current.style.setProperty("--tilt-x", "0deg");
        cardRef.current.style.setProperty("--tilt-y", "0deg");
    };


    return (
        <div
            className={`team-card-enter w-full ${cardWidthClass} ${index % 2 === 0 ? "team-card-left" : "team-card-right"}`}
            style={{ animationDelay: `${index * 85}ms` }}
        >
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={resetTilt}
                onClick={() => isTouch && setFlipped((previous) => !previous)}
                className="group relative h-[30rem] w-full cursor-pointer [perspective:1200px]"
            >
                <div
                    className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""
                        }`}
                    style={{
                        transform:
                            !isTouch && !flipped
                                ? "rotateX(var(--tilt-x,0deg)) rotateY(var(--tilt-y,0deg))"
                                : undefined,
                    }}
                >
                    {/* Front */}
                    <article
                        className={`absolute inset-0 overflow-hidden border bg-[#08111f]/90 shadow-2xl shadow-black/40 backdrop-blur-xl [backface-visibility:hidden] [clip-path:polygon(0_0,92%_0,100%_7%,100%_100%,8%_100%,0_93%)] ${isLeader
                            ? "border-amber-300/70 shadow-[0_0_28px_rgba(245,158,11,0.16)]"
                            : "border-sky-300/35"
                            }`}
                    >
                        {/* Blue-to-gold border treatment */}
                        <div className="pointer-events-none absolute inset-0 border border-transparent bg-[linear-gradient(135deg,rgba(56,189,248,0.75),transparent_24%,transparent_70%,rgba(251,146,60,0.72))] opacity-60" />


                        {/* Giant faded player number */}
                        <span className="pointer-events-none absolute -right-3 top-10 select-none font-['Anton',Impact,sans-serif] text-[10rem] leading-none text-white/[0.045] sm:text-[12rem]">
                            {roleMeta.initials}
                        </span>


                        {/* Role badge */}
                        <div
                            className={`absolute left-4 top-4 z-20 inline-flex items-center gap-2 border px-3 py-1.5 text-[10px] font-black tracking-[0.14em] [clip-path:polygon(8%_0,100%_0,92%_100%,0_100%)] ${roleMeta.badgeClass}`}
                        >
                            <span className="text-xs">{roleMeta.icon}</span>
                            {roleMeta.badge}
                        </div>


                        {/* Decorative diagonal streak */}
                        <div className="absolute right-9 top-0 h-56 w-px rotate-[25deg] bg-gradient-to-b from-transparent via-sky-300/80 to-transparent" />


                        {/* Image / initials silhouette */}
                        <div className="absolute inset-x-0 top-0 h-[67%] overflow-hidden">
                            {member.img ? (
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    loading="lazy"
                                    className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_50%_26%,rgba(56,189,248,0.32),transparent_28%),linear-gradient(145deg,#142846_0%,#07101e_58%,#2c1806_120%)]">
                                    <div className="absolute bottom-0 left-1/2 h-48 w-40 -translate-x-1/2 rounded-t-[5rem] bg-gradient-to-t from-[#02050a] via-[#0a1930] to-sky-300/20" />


                                    <div className="absolute left-1/2 top-[38%] grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-sky-200/30 bg-[#07101e]/75 shadow-[0_0_35px_rgba(56,189,248,0.22)]">
                                        <span className="font-['Anton',Impact,sans-serif] text-4xl text-sky-100">
                                            {getInitials(member.name)}
                                        </span>
                                    </div>


                                    <span className="absolute bottom-8 left-1/2 -translate-x-1/2 font-['Anton',Impact,sans-serif] text-7xl text-white/[0.07]">
                                        {roleMeta.badge.slice(0, 3)}
                                    </span>
                                </div>
                            )}


                            <div className="absolute inset-0 bg-gradient-to-t from-[#08111f] via-[#08111f]/30 to-transparent" />
                        </div>


                        {/* Mouse-following light */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                            style={{
                                background:
                                    "radial-gradient(280px circle at var(--glow-x,50%) var(--glow-y,50%),rgba(125,211,252,0.17),transparent 58%)",
                            }}
                        />


                        {/* Diagonal light sweep */}
                        <div className="pointer-events-none absolute -left-[130%] top-0 h-full w-[55%] -skew-x-[25deg] bg-gradient-to-r from-transparent via-sky-100/20 to-transparent transition-all duration-1000 group-hover:left-[145%]" />


                        {/* Bottom player details */}
                        <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-200/75">
                                Official roster
                            </p>


                            <h3 className="mt-2 font-['Anton',Impact,sans-serif] text-4xl uppercase italic leading-[0.88] tracking-wide text-white sm:text-5xl">
                                {member.name}
                            </h3>


                            <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-orange-300">
                                {member.role}
                            </p>


                            {member.role === "Developer" && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {member.skills.map((skill, skillIndex) => (
                                        <span
                                            key={skill}
                                            className="border border-sky-300/20 bg-sky-300/[0.08] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-sky-100 [clip-path:polygon(8%_0,100%_0,92%_100%,0_100%)]"
                                        >
                                            <span className="mr-1 text-orange-300">
                                                0{skillIndex + 1}
                                            </span>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}


                            <div className="mt-5 flex translate-y-3 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                <SocialButton
                                    href={member.linkedin}
                                    type="linkedin"
                                    name={member.name}
                                />
                                <SocialButton
                                    href={member.github}
                                    type="github"
                                    name={member.name}
                                />
                                <SocialButton
                                    href={member.instagram}
                                    type="instagram"
                                    name={member.name}
                                />
                            </div>


                            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 md:hidden">
                                Tap for player intel
                            </p>
                        </div>
                    </article>


                    {/* Back: shown on touch-device tap */}
                    <article className="absolute inset-0 flex rotate-y-180 flex-col justify-between overflow-hidden border border-sky-300/40 bg-[#091426]/95 p-6 [backface-visibility:hidden] [clip-path:polygon(0_0,92%_0,100%_7%,100%_100%,8%_100%,0_93%)] [transform:rotateY(180deg)]">
                        <div className="absolute -right-14 -top-14 h-56 w-56 rounded-full bg-orange-400/15 blur-3xl" />
                        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-sky-400/15 blur-3xl" />


                        <div className="relative">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-300">
                                Player intel
                            </p>


                            <h3 className="mt-4 font-['Anton',Impact,sans-serif] text-4xl uppercase italic leading-none text-white">
                                {member.name}
                            </h3>


                            <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-orange-300">
                                {member.role}
                            </p>


                            <div className="mt-6 h-px w-full bg-gradient-to-r from-sky-300 via-amber-300 to-transparent" />


                            <p className="mt-6 text-sm leading-7 text-slate-300">
                                {member.bio}
                            </p>
                        </div>


                        <div className="relative">
                            {member.skills.length > 0 && (
                                <div className="mb-5 flex flex-wrap gap-2">
                                    {member.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-200 [clip-path:polygon(8%_0,100%_0,92%_100%,0_100%)]"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}


                            <div className="flex gap-2">
                                <SocialButton
                                    href={member.linkedin}
                                    type="linkedin"
                                    name={member.name}
                                />
                                <SocialButton
                                    href={member.github}
                                    type="github"
                                    name={member.name}
                                />
                                <SocialButton
                                    href={member.instagram}
                                    type="instagram"
                                    name={member.name}
                                />
                            </div>


                            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                                Tap again to return
                            </p>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
}


function SectionHeading({ eyebrow, title, count }) {
    return (
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-300">
                    {eyebrow}
                </p>


                <h2 className="mt-2 font-['Anton',Impact,sans-serif] text-5xl uppercase italic leading-none tracking-wide text-white sm:text-6xl">
                    {title}
                </h2>
            </div>


            {typeof count === "number" && (
                <div className="w-fit border border-amber-300/25 bg-amber-300/[0.08] px-4 py-2 text-xs font-black uppercase tracking-[0.13em] text-amber-200 [clip-path:polygon(8%_0,100%_0,92%_100%,0_100%)]">
                    {count} player{count !== 1 ? "s" : ""}
                </div>
            )}
        </div>
    );
}


export default function Ourteam() {
    const [activeFilter, setActiveFilter] = useState("all");


    const [membersRef, memberCount] = useCountUp(TEAM.length);
    const [developerRef, developerCount] = useCountUp(
        TEAM.filter((member) => member.role === "Developer").length
    );
    const [eventRef, eventCount] = useCountUp(6);


    const groupedMembers = useMemo(() => {
        const sorted = [...TEAM].sort(
            (a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role)
        );


        return {
            convenor: sorted.filter((member) => member.role === "Convenor"),
            coConvenor: sorted.filter((member) => member.role === "Co-Convenor"),
            developers: sorted.filter((member) => member.role === "Developer"),
            coreMembers: sorted.filter((member) => member.role === "Core Member"),
        };
    }, []);


    const featuredMembers = [
        ...groupedMembers.convenor,
        ...groupedMembers.coConvenor,
    ];


    const showConvenors =
        activeFilter === "all" || activeFilter === "convenors";
    const showDevelopers =
        activeFilter === "all" || activeFilter === "developers";
    const showCoreMembers = activeFilter === "all" || activeFilter === "core";


    return (
        <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#05080f_0%,#07101f_46%,#0a1226_100%)] text-white">
            <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800;900&display=swap");


        @keyframes glitch-reveal {
          0% {
            opacity: 0;
            clip-path: inset(0 100% 0 0);
            transform: translateX(-28px) skewX(-12deg);
          }


          50% {
            opacity: 1;
            clip-path: inset(0 0 0 0);
            transform: translateX(5px) skewX(-12deg);
          }


          65% {
            transform: translateX(-4px) skewX(-12deg);
          }


          100% {
            opacity: 1;
            clip-path: inset(0 0 0 0);
            transform: translateX(0) skewX(-12deg);
          }
        }


        @keyframes marquee {
          from {
            transform: translateX(0);
          }


          to {
            transform: translateX(-50%);
          }
        }


        @keyframes shine-sweep {
          0% {
            transform: translateX(-150%) skewX(-24deg);
          }


          60%,
          100% {
            transform: translateX(250%) skewX(-24deg);
          }
        }


        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-42px);
          }


          to {
            opacity: 1;
            transform: translateX(0);
          }
        }


        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(42px);
          }


          to {
            opacity: 1;
            transform: translateX(0);
          }
        }


        .glitch-title {
          animation: glitch-reveal 950ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }


        .marquee-track {
          animation: marquee 27s linear infinite;
        }


        .team-card-left {
          animation: slide-in-left 650ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }


        .team-card-right {
          animation: slide-in-right 650ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }


        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>


            {/* Background grid, subtle noise, diagonal stripe texture */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(125,211,252,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.035)_1px,transparent_1px)] bg-[size:42px_42px]" />


                <div className="absolute inset-0 opacity-[0.05] [background-image:repeating-linear-gradient(-35deg,transparent_0,transparent_13px,#7dd3fc_14px,transparent_15px,transparent_30px)]" />


                <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(rgba(255,255,255,0.85)_0.5px,transparent_0.7px)] [background-size:5px_5px]" />


                <div className="absolute -left-56 top-20 h-[36rem] w-[36rem] rounded-full bg-sky-500/15 blur-[145px]" />


                <div className="absolute -right-60 top-[28rem] h-[38rem] w-[38rem] rounded-full bg-orange-500/15 blur-[150px]" />


                <div className="absolute right-[8%] top-40 h-px w-80 rotate-[-20deg] bg-gradient-to-r from-transparent via-sky-300/70 to-transparent shadow-[0_0_20px_rgba(56,189,248,0.7)]" />


                <div className="absolute left-[6%] top-[62rem] h-px w-72 rotate-[18deg] bg-gradient-to-r from-transparent via-amber-300/70 to-transparent shadow-[0_0_20px_rgba(245,158,11,0.6)]" />
            </div>


            {/* Hero */}
            <section className="relative mx-auto max-w-7xl px-5 pb-10 pt-20 sm:px-8 sm:pt-28 lg:px-10">
                <div className="max-w-5xl">
                    <div className="inline-flex items-center gap-2 border border-sky-300/30 bg-sky-300/[0.07] px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-sky-200 [clip-path:polygon(7%_0,100%_0,93%_100%,0_100%)] sm:text-xs">
                        <span className="h-2 w-2 bg-sky-300 shadow-[0_0_10px_rgba(56,189,248,1)]" />
                        Srijan 2026 // Official Roster
                    </div>


                    <p className="mt-8 text-xs font-black uppercase tracking-[0.24em] text-orange-300">
                        Tournament lineup
                    </p>


                    <h1 className="glitch-title mt-3 font-['Anton',Impact,sans-serif] text-6xl uppercase italic leading-[0.82] tracking-tight sm:text-8xl md:text-9xl">
                        <span className="block text-white">Meet the</span>
                        <span className="block bg-gradient-to-r from-sky-300 via-sky-100 to-amber-300 bg-clip-text text-transparent">
                            Squad
                        </span>
                    </h1>


                    <div className="mt-7 flex max-w-2xl gap-4">
                        <span className="h-14 w-1 shrink-0 bg-gradient-to-b from-sky-300 via-amber-300 to-orange-400" />


                        <p className="text-base font-medium leading-7 text-slate-300 sm:text-lg sm:leading-8">
                            The crew behind every event. Built different. Playing to win.
                        </p>
                    </div>
                </div>


                {/* Stats */}
                <div className="mt-12 grid max-w-3xl grid-cols-3 border border-white/10 bg-[#091221]/80 shadow-2xl shadow-black/30 backdrop-blur-xl [clip-path:polygon(0_0,98%_0,100%_13%,100%_100%,2%_100%,0_87%)]">
                    <div ref={membersRef} className="relative px-3 py-5 text-center sm:px-8">
                        <p className="font-['Anton',Impact,sans-serif] text-4xl italic leading-none text-sky-200 sm:text-5xl">
                            {memberCount}+
                        </p>
                        <p className="mt-2 text-[9px] font-black uppercase tracking-[0.13em] text-slate-400 sm:text-[10px]">
                            Total Members
                        </p>
                        <span className="absolute right-0 top-1/2 hidden h-10 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-amber-300 to-transparent sm:block" />
                    </div>


                    <div ref={developerRef} className="relative px-3 py-5 text-center sm:px-8">
                        <p className="font-['Anton',Impact,sans-serif] text-4xl italic leading-none text-amber-300 sm:text-5xl">
                            {developerCount}
                        </p>
                        <p className="mt-2 text-[9px] font-black uppercase tracking-[0.13em] text-slate-400 sm:text-[10px]">
                            Developers
                        </p>
                        <span className="absolute right-0 top-1/2 hidden h-10 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-sky-300 to-transparent sm:block" />
                    </div>


                    <div ref={eventRef} className="px-3 py-5 text-center sm:px-8">
                        <p className="font-['Anton',Impact,sans-serif] text-4xl italic leading-none text-orange-300 sm:text-5xl">
                            {eventCount}
                        </p>
                        <p className="mt-2 text-[9px] font-black uppercase tracking-[0.13em] text-slate-400 sm:text-[10px]">
                            Events
                        </p>
                    </div>
                </div>
            </section>


            {/* Tilted event marquee */}
            <section className="relative overflow-hidden border-y border-amber-300/30 bg-[#080f1d] py-3 shadow-[0_0_30px_rgba(245,158,11,0.09)]">
                <div className="-rotate-[1.2deg] scale-105">
                    <div className="marquee-track flex w-max whitespace-nowrap">
                        {[...Array(3)]
                            .flatMap(() => EVENTS.flatMap((event) => [event, "⚡"]))
                            .map((item, index) => (
                                <span
                                    key={`${item}-${index}`}
                                    className={`mx-4 font-['Anton',Impact,sans-serif] text-2xl uppercase italic tracking-wide sm:text-3xl ${item === "⚡" ? "text-sky-300" : "text-amber-300"
                                        }`}
                                >
                                    {item}
                                </span>
                            ))}
                    </div>
                </div>
            </section>


            {/* Sticky tournament filters */}
            <section className="sticky top-0 z-40 border-b border-white/10 bg-[#05080f]/90 shadow-xl shadow-black/30 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl overflow-x-auto px-5 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-8 lg:px-10">
                    <div className="flex min-w-max gap-2">
                        {FILTERS.map((filter) => {
                            const isActive = activeFilter === filter.id;


                            return (
                                <button
                                    key={filter.id}
                                    type="button"
                                    onClick={() => setActiveFilter(filter.id)}
                                    className={`border px-5 py-3 text-xs font-black uppercase tracking-[0.12em] transition-all duration-300 [clip-path:polygon(8%_0,100%_0,92%_100%,0_100%)] ${isActive
                                        ? "border-amber-100 bg-gradient-to-r from-amber-300 to-orange-400 text-[#05080f] shadow-[0_0_24px_rgba(245,158,11,0.3)]"
                                        : "border-white/10 bg-white/[0.035] text-slate-300 hover:border-sky-300/60 hover:bg-sky-300/[0.08] hover:text-sky-100"
                                        }`}
                                >
                                    {filter.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>


            {/* Roster content */}
            <div key={activeFilter} className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
                {/* Convenor and Co-Convenor */}
                {showConvenors && (
                    <section>
                        <SectionHeading
                            eyebrow="Leadership bracket // 01"
                            title="Convenors"
                            count={featuredMembers.length}
                        />


                        <div className="flex flex-wrap justify-center gap-5">
                            {featuredMembers.map((member, index) => (
                                <PlayerCard
                                    key={member.name}
                                    member={member}
                                    index={index}
                                    cardWidthClass="sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.834rem)] xl:w-[calc(25%-0.938rem)]"
                                />
                            ))}
                        </div>
                    </section>
                )}


                {/* Developers */}
                {showDevelopers && (
                    <section className={showConvenors ? "mt-20" : ""}>
                        <SectionHeading
                            eyebrow="Technical Team // 02"
                            title="Developers"
                            count={groupedMembers.developers.length}
                        />


                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {groupedMembers.developers.map((member, index) => (
                                <PlayerCard
                                    key={member.name}
                                    member={member}
                                    index={index}
                                />
                            ))}
                        </div>
                    </section>
                )}


                {/* Core Members */}
                {showCoreMembers && (
                    <section
                        className={showConvenors || showDevelopers ? "mt-20" : ""}
                    >
                        <SectionHeading
                            eyebrow="Operations division // 03"
                            title="Core Members"
                            count={groupedMembers.coreMembers.length}
                        />


                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {groupedMembers.coreMembers.map((member, index) => (
                                <PlayerCard
                                    key={member.name}
                                    member={member}
                                    index={index}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>


            {/* Tournament CTA */}
            <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
                <div className="relative overflow-hidden border border-amber-300/40 bg-[linear-gradient(120deg,#0b172b_0%,#101a2d_45%,#2b1b08_125%)] px-6 py-12 shadow-[0_0_50px_rgba(245,158,11,0.12)] [clip-path:polygon(0_0,97%_0,100%_14%,100%_100%,3%_100%,0_86%)] sm:px-10 sm:py-16">
                    <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-orange-400/20 blur-[100px]" />
                    <div className="absolute -bottom-24 left-8 h-56 w-56 rounded-full bg-sky-400/15 blur-[90px]" />


                    <div className="relative max-w-3xl">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-300">
                            Your arena is waiting
                        </p>


                        <h2 className="mt-4 font-['Anton',Impact,sans-serif] text-5xl uppercase italic leading-[0.88] tracking-wide text-white sm:text-7xl">
                            Join the squad.
                            <span className="mt-1 block bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                                Register for Srijan 2026.
                            </span>
                        </h2>


                        <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                            Choose your event, build your team, and compete in the biggest
                            technical arena of Srijan 2026.
                        </p>


                        <a
                            href="/events"
                            className="group relative mt-8 inline-flex overflow-hidden border border-amber-100 bg-gradient-to-r from-amber-300 to-orange-400 px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#05080f] shadow-[0_0_25px_rgba(245,158,11,0.25)] transition hover:scale-[1.03] [clip-path:polygon(7%_0,100%_0,93%_100%,0_100%)]"
                        >
                            <span className="relative z-10">Explore Events →</span>


                            <span className="absolute inset-y-0 left-0 w-1/3 bg-white/45 animate-[shine-sweep_3s_ease-in-out_infinite]" />
                        </a>
                    </div>
                </div>
            </section>


            <footer className="relative border-t border-white/10 px-5 py-8 text-center">
                <div className="mx-auto mb-4 h-px w-32 bg-gradient-to-r from-transparent via-sky-300 to-transparent" />


                <p className="font-['Anton',Impact,sans-serif] text-lg uppercase italic tracking-[0.12em] text-slate-400">
                    Srijan 2026 // Build. Compete. Create.
                </p>
            </footer>
        </main>
    );
}