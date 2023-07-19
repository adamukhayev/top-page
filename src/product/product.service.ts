import { Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ProductModel } from "./product.model/product.model";
import { DocumentType, ModelType } from "@typegoose/typegoose/lib/types";
import { CreateProductDto } from "./dto/create.product.dto";
import { FindProductDto } from "./dto/find-product.dto";
import { Types } from "mongoose";
import { ReviewModel } from "../review/review.model/review.model";

@Injectable()
export class ProductService {
  constructor(@InjectModel(ProductModel) private readonly product: ModelType<ProductModel>) {}

  async create(dto: CreateProductDto): Promise<DocumentType<ProductModel>> {
    return this.product.create(dto)
  }

  async findById(id: string): Promise<DocumentType<ProductModel>> {
    return this.product.findById(id).exec();
  }

  async updateById(id: string, dto: CreateProductDto): Promise<DocumentType<ProductModel>> {
    return this.product.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async deleteById(id: string): Promise<DocumentType<ProductModel> | null> {
    return this.product.findByIdAndDelete(id).exec();
  }

  async findWithReviews(findDto: FindProductDto) {
    return await this.product.aggregate([
      {
        $match: {
          categories: findDto.category
        }
      },
      {
        $sort: {
          _id: 1
        }
      },
      {
        $limit: findDto.limit
      },
      {
        $lookup: {
          from: 'Review',
          localField: '_id',
          foreignField: 'productId',
          as: 'reviews'
        }
      },
      {
        $addFields: {
          reviewCount: { $size: '$reviews' },
          reviewAvg: { $avg: '$reviews.rating' },
          reviews: {
            $functions: {
              body: `function(reviews) {
                reviews.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
              }`,
              args: ['$reviews'],
              lang: 'js'
            }
          }
        }
      }
    ]).exec() as
      (ProductModel & { review: ReviewModel[], reviewCount: number, reviewAvg: number })[];
  }
}
