import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { index, prop } from "@typegoose/typegoose";

export interface TopPageModel extends Base {}
export enum TopLevelCategory {
  Courses,
  Services,
  Books,
  Products
}

export class HhData {

  @prop()
  count: number;

  @prop()
  juniorSalary: number;

  @prop()
  middleSalary: number;

  @prop()
  seniorSalary: number;
}

export class TopPageAdvantage {

  @prop()
  title: string;

  @prop()
  description: string;
}
@index({ '$**': "text" })
export class TopPageModel extends TimeStamps {

  @prop({enum: TopLevelCategory})
  firstCategory: TopLevelCategory;

  @prop()
  secondCategory: string;

  @prop()
  title: string;

  @prop()
  category: string;

  @prop({unique: true})
  alias: string;

  @prop({type: () => [HhData], _id: false})
  hh?: HhData;

  @prop({type: () => [TopPageAdvantage], _id: false})
  advantages: TopPageAdvantage[];

  @prop()
  seoText: string;

  @prop()
  tagsTitle: string;

  @prop({type: () => [String]})
  tags: string[];
}
