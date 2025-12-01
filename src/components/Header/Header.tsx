import type React from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link, useMatch } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import routes from "@/routes/routes.const";
import {
  ShoppingCart,
  User,
  FileText,
  CreditCard,
  Package,
  LogOut,
  Trash2,
  ArrowBigRight,
} from "lucide-react";
import useAuth from "@/context/AuthContext";
import { CartApi } from "@/api/cart.api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AuthApi } from "@/api/auth.api";
import { toast } from "react-toastify";
import { signOut } from "@/context/AuthContext/auth.action";


export default function Header() {
  const match = useMatch("");

  const {
    state: { isAuthenticated, user: currentUser },
    dispatch,
  } = useAuth();


  const { data: cartData, isError: isCartError } = useQuery({
    queryKey: ["cart", "me"],
    queryFn: CartApi.getMyCart,
    enabled: !!isAuthenticated,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const safeCartData = isCartError || !cartData ? null : cartData.data;

  const cartItems = safeCartData?.items ?? [];
  const totalItems = safeCartData?.totalItems ?? 0;
  const totalPrice = safeCartData?.subtotal ?? 0;

  const signOutMutation = useMutation({
    mutationKey: ["sign-out"],
    mutationFn: () => AuthApi.signOut(),
    onSettled: () => {
      dispatch(signOut());
      toast.success("Đăng xuất thành công");
    },
  });

  return (
    <header className="sticky top-0 z-50 border-b border-primary-color bg-white/80 backdrop-blur-md shadow-sm">
      <div className="main-layout flex h-20 shrink-0 items-center">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden bg-transparent"
            >
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-3">
            <Link to={routes.HOME} className="flex items-center gap-2 mb-4">
              <img src="/images/student.png" alt="Logo" className="h-10 w-10" />
              <span className="font-bold text-primary-color">K-English</span>
            </Link>
            <div className="grid gap-2 py-4">
              <NavLinkMobile to={routes.HOME}>Trang chủ</NavLinkMobile>
              <NavLinkMobile to={routes.COURSES}>Khoá học</NavLinkMobile>
              <NavLinkMobile to={routes.SPEAKING_LOBBY}>Luyện nói</NavLinkMobile>
              <NavLinkMobile to={routes.AI_TUTOR}>AI Tutor</NavLinkMobile>
              <NavLinkMobile to={routes.POSTS}>Bài viết</NavLinkMobile>
              <NavLinkMobile to={routes.FLASHCARDS}>Từ vựng</NavLinkMobile>
              <NavLinkMobile to={routes.DICTATION_TOPICS}>
                Nghe chép chính tả
              </NavLinkMobile>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo desktop */}
        <Link
          to={routes.HOME}
          className="mr-6 hidden lg:flex items-center gap-2"
        >
          <img src="/images/student.png" alt="Logo" className="h-10 w-10" />
          {/* <span className="font-bold text-primary-color text-lg">
            K-English
          </span> */}
        </Link>

        {/* Desktop navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavLinkDesktop to={routes.HOME}>Trang chủ</NavLinkDesktop>
            <NavLinkDesktop to={routes.COURSES}>Khoá học</NavLinkDesktop>
            <NavLinkDesktop to={routes.SPEAKING_LOBBY}>Luyện nói</NavLinkDesktop>
            <NavLinkDesktop to={routes.AI_TUTOR}>AI Tutor</NavLinkDesktop>
            <NavLinkDesktop to={routes.POSTS}>Bài viết</NavLinkDesktop>
            <NavLinkDesktop to={routes.FLASHCARDS}>Từ vựng</NavLinkDesktop>

            <NavLinkDesktop to={routes.DICTATION_TOPICS}>
              Nghe chép chính tả
            </NavLinkDesktop>
            {match && (
              <NavigationMenuLink asChild>
                <HashLink
                  smooth
                  to="#contact"
                  className="group inline-flex h-9 w-max items-center text-primary-color justify-center rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-gray-100 hover:text-gray-900"
                >
                  Liên hệ
                </HashLink>
              </NavigationMenuLink>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Auth + Cart */}
        <div className="ml-auto flex items-center gap-x-5">
          {isAuthenticated ? (
            <>
              {/* Giỏ hàng */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <ShoppingCart className="h-5 w-5 text-primary-color" />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                        {totalItems}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-0" align="end">
                  <div className="p-4">
                    <h3 className="font-semibold mb-3">
                      Giỏ hàng ({totalItems})
                    </h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {cartItems.slice(0, 5).map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-3 p-2 hover:bg-gray-50 rounded-lg"
                        >
                          <img
                            src={item.thumbnailUrl || "/placeholder.svg"}
                            alt={item.title}
                            className="w-16 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2 mb-1">
                              {item.title}
                            </h4>
                            <p className="text-xs text-gray-500 mb-1">
                              {item.teacher?.fullName ?? "Giảng viên ẩn"}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-primary-color">
                                  {item.price.toLocaleString()}đ
                                </span>
                                <span className="text-xs text-gray-400 line-through">
                                  {item.discountPrice.toLocaleString()}đ
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold">Tổng cộng:</span>
                        <span className="font-bold text-lg text-primary-color">
                          {totalPrice.toLocaleString()}đ
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 bg-transparent"
                          asChild
                        >
                          <Link to={routes.CART}>Xem giỏ hàng</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full cursor-pointer"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={currentUser?.avatarUrl}
                        alt="User"
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {currentUser?.fullName.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{currentUser?.fullName}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {currentUser?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    {currentUser?.role === "ADMIN" && (
                      <Link to={routes.DASHBOARD} className="cursor-pointer">
                        <ArrowBigRight className="mr-2 h-4 w-4" />
                        <span>Tới trang quản trị</span>
                      </Link>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    {currentUser?.role === "TEACHER" && (
                      <Link to={routes.COURSES_MANAGEMENT} className="cursor-pointer">
                        <ArrowBigRight className="mr-2 h-4 w-4" />
                        <span>Tới trang quản trị</span>
                      </Link>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={routes.ACCOUNT} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Tài khoản</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={routes.MY_POSTS} className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Bài viết của tôi</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={routes.MY_FLASHCARDS} className="cursor-pointer">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Flashcard của tôi</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={routes.CART} className="cursor-pointer">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      <span>Giỏ hàng</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={routes.MY_COURSES} className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      <span>Khóa học của tôi</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => signOutMutation.mutate()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex gap-2">
              <Button
                asChild
                variant="outline"
                className="text-primary-color bg-transparent"
              >
                <Link to={routes.SIGN_UP}>Đăng ký</Link>
              </Button>
              <Button className="bg-primary-color hover:bg-hover-primary-color">
                <Link to={routes.SIGN_IN}>Đăng nhập</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function NavLinkDesktop({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <NavigationMenuLink asChild>
      <Link
        to={to}
        className="group inline-flex h-9 w-max items-center text-primary-color justify-center rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-gray-100 hover:text-gray-900"
      >
        {children}
      </Link>
    </NavigationMenuLink>
  );
}

function NavLinkMobile({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="flex w-full items-center py-2 text-[14px] font-bold text-primary-color hover:bg-gray-50 rounded-md px-2 transition-colors"
    >
      {children}
    </Link>
  );
}
