import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "~/components/ui/navigation-menu";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import { useHref, Form, Link } from "@remix-run/react";
import React from "react";

export function Navbar({ user }: { user: any }) {
  const navigation = [
    { id: 1, name: "Home", href: "/" },
    /*  { id: 2, name: "Dashboard", href: "/dashboard" },
    { id: 3, name: "Leaderboard", href: "/leaderboard" }, */
    { id: 2, name: "Servers", href: "/servers" },
    { id: 3, name: "Playground", href: "/playground" },
    { id: 4, name: "Shop", href: "/shop" },
  ];

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const noUserPages = ["Home", "Playground"];
  const noUserPagesItem = navigation.filter((item) =>
    noUserPages.includes(item.name)
  );

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }
  const pathname = useHref("", { relative: "route" });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 justify-between">
        <div className="flex">
          <div className="flex flex-shrink-0 items-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              className="text-gray-100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="100%" height="100%" rx="16" fill="currentColor" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
                fill="black"
              />
            </svg>
          </div>
          <NavigationMenu>
            <NavigationMenuList>
              {user.authenticated ? (
                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <NavigationMenuItem key={item.id}>
                      <NavigationMenuLink
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          pathname === item.href
                            ? "border-slate-500 text-gray-900"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                          "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                        )}
                        aria-current={"page"}
                      >
                        {item.name}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </div>
              ) : (
                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                  {noUserPagesItem.map((item) => (
                    <NavigationMenuItem key={item.id}>
                      <NavigationMenuLink
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          pathname === item.href
                            ? "border-slate-500 text-gray-900"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                          "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                        )}
                        aria-current={
                          pathname === item.href ? "page" : undefined
                        }
                      >
                        {item.name}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </div>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="hidden sm:ml-6 sm:flex sm:items-center">
          <NavigationMenu className="right-0">
            <NavigationMenuList className="">
              {user.authenticated ? (
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <Avatar>
                      <AvatarImage
                        src={`https://cdn.discordapp.com/avatars/${user.authenticated.id}/${user.authenticated.avatar}`}
                      />
                    </Avatar>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6">
                      <ListItem href="/profile" title="Profile"></ListItem>
                      <Form method="post" action="/logout">
                        <Button type="submit">Logout</Button>
                      </Form>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem>
                  <Form method="post" action="/auth/discord">
                    <Button type="submit">Login</Button>
                  </Form>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
