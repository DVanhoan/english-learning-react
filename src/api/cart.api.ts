import http from "./http";
import { CART_PATH } from "./path";
import type {
    SuccessResponse,
    SuccessResponseNoData,
} from "@/types/common.type";
import type { AddToCartRequest, CartResponse } from "@/types/cart.type";

export class CartApi {
    static getMyCart = async () => {
        const response = await http.get<SuccessResponse<CartResponse>>(CART_PATH.ME);
        return response.data;
    };

    static getCartItemCount = async () => {
        const response = await http.get<SuccessResponse<number>>(CART_PATH.COUNT);
        return response.data;
    };

    static addToCart = async (data: AddToCartRequest) => {
        const response = await http.post<SuccessResponseNoData>(CART_PATH.ADD, data);
        return response.data;
    };

    static removeFromCart = async (courseId: number | string) => {
        const response = await http.delete<SuccessResponseNoData>(
            CART_PATH.REMOVE(courseId)
        );
        return response.data;
    };
}