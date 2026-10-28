import { vi } from "vitest";

export const redirect = vi.fn();
export const useRouter = () => ({ push: vi.fn() });
export const usePathname = () => "/";
