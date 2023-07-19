import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { TopPageModel } from "./top-page.model/top-page.model";
import { DocumentType, ModelType } from "@typegoose/typegoose/lib/types";
import { CreateTopPageDto } from "./dto/create-top-page.dto";
import { TOP_PAGE_NOT_FOUND_ERROR } from "./top-page.constants";
import { FindTopPageDto } from "./dto/find-top-page.dto";

@Injectable()
export class TopPageService {

  constructor(@InjectModel(TopPageModel) private readonly topPage: ModelType<TopPageModel>) {
  }

  async createTopPage(dto: CreateTopPageDto): Promise<DocumentType<TopPageModel>>  {
    return this.topPage.create(dto);
  }

  async getTopPageById(id: string): Promise<DocumentType<TopPageModel>> {
    const page = this.topPage.findById(id).exec();

    if (!page) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR)
    }
    return page;
  }

  async getTopPageByText(text: string) {
    const page = this.topPage.find({ $text: {
      $search: text, $caseSensitive: false
      }}).exec();

    if (!page) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR)
    }

    return page;
  }

  async getTopPageByAlias(alias: string): Promise<DocumentType<TopPageModel>> {
    const page = this.topPage.findOne({ alias }).exec();

    if (!page) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR)
    }
    return page;
  }

  async updateTopPageById(id: string, dto: CreateTopPageDto): Promise<DocumentType<TopPageModel>> {
    const topPage = this.getTopPageById(id);
    if (!topPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR)
    }

    return this.topPage.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async deleteTopPageById(id: string): Promise<DocumentType<TopPageModel>> {
    const topPage = this.getTopPageById(id);
    if (!topPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR)
    }

    return this.topPage.findByIdAndDelete(id).exec();
  }

  async findByCategory(firstCategory: FindTopPageDto) {
    return this.topPage.aggregate()
      .match({
        firstCategory
      })
      .group({
        _id: { secondCategory: '$secondCategory'},
        pages: { $push: { alias: '$alias', title: '$title'}}
      }).exec();
  }
}
