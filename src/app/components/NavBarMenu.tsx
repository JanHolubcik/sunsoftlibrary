"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from "@nextui-org/react";
import { usePathname } from "next/navigation";

export default function NavBarComponent() {
  const pathname = usePathname();
  return (
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-inherit">
          <Link color="foreground" href="/">
            SUNSOFT LIBRARY
          </Link>
        </p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link
            color={pathname === "/books" ? "primary" : "foreground"}
            href="/books"
          >
            Books
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === "/users"}>
          <Link
            color={pathname === "/users" ? "primary" : "foreground"}
            href="/users"
          >
            Users
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === "/bookloans"}>
          <Link
            color={pathname === "/bookloans" ? "primary" : "foreground"}
            href="/bookloans"
          >
            Book loans
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
