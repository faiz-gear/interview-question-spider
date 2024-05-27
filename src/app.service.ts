import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import fs from 'fs';
import html2md from 'html-to-md';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async startSpider() {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: {
        width: 0,
        height: 0,
      },
    });

    const page = await browser.newPage();

    await page.goto(
      'https://github.com/pro-collection/interview-question/issues?q=is%3Aopen+is%3Aissue+milestone%3A%E9%AB%98',
    );

    // 等待job-list-box元素加载完成
    await page.waitForSelector('.paginate-container');

    // 获取当前页数
    const totalPage = await page.$eval(
      '.pagination a:nth-last-child(2)',
      (el) => {
        return parseInt(el.textContent);
      },
    );
    console.log(
      '🚀 ~ file: app.service.ts ~ line 37 ~ AppService ~ startSpider ~ totalPage',
      totalPage,
    );

    // 存储所有面试问题
    const allInterviewQuestion = [];
    for (let i = 1; i <= 1; i++) {
      await page.goto(
        `https://github.com/pro-collection/interview-question/issues?page=${i}&q=is%3Aissue+is%3Aopen`,
      );

      await page.waitForSelector('.js-navigation-container');

      const questions = await page.$eval('.js-navigation-container', (el) => {
        return [...el.querySelectorAll('.Box-row')].map((item) => {
          return {
            question: {
              title: item.querySelector('.Link--primary').textContent,
              labels: [...item.querySelectorAll('.lh-default a')].map((el) =>
                el.textContent.trim(),
              ),
              level: item
                .querySelector('.issue-milestone .css-truncate-target')
                .textContent.trim(),
            },
            link: (item.querySelector('a.Link--primary') as HTMLAnchorElement)
              .href,
          };
        });
      });
      allInterviewQuestion.push(...questions);
    }

    let mdContent = '';

    // 获取题目回答
    for (let i = 0; i < allInterviewQuestion.length; i++) {
      await page.goto(allInterviewQuestion[i].link);

      try {
        await page.waitForSelector('.comment-body');

        const commentHtmlString = await page.$eval(
          '.comment-body',
          (el) => el.outerHTML,
        );

        const md = html2md(
          commentHtmlString,
          {
            ignoreTags: [
              '',
              'style',
              'head',
              '!doctype',
              'form',
              'svg',
              'noscript',
              'script',
              'meta',
            ],
            skipTags: [
              'div',
              'html',
              'body',
              'nav',
              'section',
              'footer',
              'main',
              'aside',
              'article',
              'header',
            ],
            emptyTags: [],
            aliasTags: {
              figure: 'p',
              dl: 'p',
              dd: 'p',
              dt: 'p',
              figcaption: 'p',
            },
            renderCustomTags: true,
          },
          true,
        );

        mdContent += md;

        // console.log(allJobs[i]);
      } catch (e) {
        console.log(
          '🚀 ~ file: app.service.ts ~ line 130 ~ AppService ~ startSpider ~ e',
          e,
        );
      }
    }

    // 保存数据
    fs.writeFileSync('./interview-question.md', mdContent);
    console.log(
      '🚀 ~ file: app.service.ts ~ line 142 ~ AppService ~ startSpider ~ mdContent',
      mdContent,
    );

    // // 清空Job表
    // this.entityManager.clear(Job);
  }
}
