import { FileHandle } from "./file-handle.model";

export interface Product {
    productId?: number,     // Optional because it's auto-incremented by the database
    productName:string,
    productDesc: string,
    productDiscPrice: number,
    productOgPrice: number,
    
    productImages: FileHandle[]
}