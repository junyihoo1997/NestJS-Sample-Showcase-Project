import { Product } from '../entities/product.entity';

export class ProductResource {
	private product: Product;

	constructor(product: Product) {
		this.product = product;
	};

	get response() {
		return {
			id: this.product.id,
			name: this.product.name,
			description: this.product.description,
			sku: this.product.sku,
			price: this.product.price,
			quantity: this.product.quantity,
		};
	}
}