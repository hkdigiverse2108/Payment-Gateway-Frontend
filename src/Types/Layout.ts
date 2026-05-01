export type Role = "admin" | "user";

export type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    roles: Role[];
    number?: number;
    children?: {
        name: string;
        path: string;
        roles?: Role[];
        pro?: boolean;
        new?: boolean;
        number?: number;
    }[];
};