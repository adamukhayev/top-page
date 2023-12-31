import { Injectable } from "@nestjs/common";
import { ReviewModel } from "./review.model/review.model";
import { ModelType, DocumentType } from "@typegoose/typegoose/lib/types";
import { CreateReviewDto } from "./dto/create-review.dto";
import { Types } from "mongoose";
import { ObjectId } from 'bson';
import { InjectModel } from "nestjs-typegoose";

@Injectable()
export class ReviewService {

  constructor(@InjectModel(ReviewModel) private readonly reviewModel: ModelType<ReviewModel>)  {

  }
  async create(dto: CreateReviewDto): Promise<DocumentType<ReviewModel>> {
    return this.reviewModel.create(dto);
  }

  async deleteById(id: string): Promise<DocumentType<ReviewModel> | null> {
    return this.reviewModel.findByIdAndDelete(id).exec();
  }

  async findByProductId(productId: string): Promise<DocumentType<ReviewModel>[]> {
    return this.reviewModel.find({ productId: new ObjectId(productId) }).exec();
  }

  async deleteByProductId(productId: string) {
    return this.reviewModel.deleteMany({ productId: new ObjectId(productId) }).exec();
  }

}
