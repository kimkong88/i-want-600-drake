import request from 'request';
import cheerio from 'cheerio';
import { constant } from '../const/constant';

export class CrawlingService {
  selectors = constant.selectors;
  priceArray: number[][] = [];

  constructor() {
  };

  crawlWithUrl(url: string): number[][] {
    request(url, (err, { }, html) => {
      if (!err) {
        const $ = cheerio.load(html);

        this.selectors.forEach(selector => {
          this.priceArray.push(this.crawl($, selector));
          if (this.priceArray.length > this.selectors.length) {
            this.selectors.forEach(() => {
              this.priceArray.shift();
            });
          }
        });
      }
    });
    return this.priceArray;
  }

  private crawl($: CheerioStatic, selector: string): number[] {
    let priceArray: number[] = [];

    $(selector).filter(({ }: number, cheerioElement: CheerioElement): boolean => {
      const data = $(cheerioElement);
      const children = data.toArray();
      let stringArray: string[] = [];

      this.interateChildren(stringArray, children);

      stringArray.forEach(string => {
        this.parseStringToNumber(priceArray, string);
      });

      return true;
    });
    return priceArray;
  }

  private parseStringToNumber(priceArray: number[], string: string) {
    let price;
    if (string.includes('$')) {
      price = string;
      price = parseInt(string.replace('$', '').replace(',', ''));

      priceArray.push(price);
    }
  }

  private interateChildren(stringArray: string[], children: CheerioElement[]) {
    children.forEach(element => {
      let elementData: string = <string>element.data;

      if (elementData) {
        elementData = elementData.trim();

        if (elementData) {
          stringArray.push(elementData);
        }
      }

      if (element.children) {
        this.interateChildren(stringArray, element.children);
      }
      return;
    });
  }
}
