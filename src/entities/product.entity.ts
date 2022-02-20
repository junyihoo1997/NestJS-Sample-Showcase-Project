import { Entity, Index, Property } from '@mikro-orm/core';
import { Base } from './base.entity';

@Entity({ tableName: 'product' })
export class Product extends Base {
	@Property()
	name!: string;

	@Property()
	description?: string;

	@Property()
	sku?: string;

	@Property()
	price?: number;

	@Property()
	quantity?: number;
}