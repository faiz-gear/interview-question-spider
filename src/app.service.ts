import { Inject, Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import TurndownService from 'turndown';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  async upsertQuestionWithLabels(questionData) {
    const { title, level, link, answer, issueId, labels } = questionData;

    // Upsert the Question
    const question = await this.prismaService.question.upsert({
      where: { issueId: issueId },
      update: {
        title: title,
        level: level,
        link: link,
        answer: answer,
      },
      create: {
        title: title,
        level: level,
        link: link,
        answer: answer,
        issueId: issueId,
      },
    });

    // Handle the labels
    for (const labelName of labels) {
      // Upsert the Label
      const label = await this.prismaService.label.upsert({
        where: { label: labelName },
        update: {},
        create: { label: labelName },
      });

      // Connect the Question and the Label
      await this.prismaService.questionsOnLabels.upsert({
        where: {
          QuestionId_LabelId: {
            QuestionId: question.id,
            LabelId: label.id,
          },
        },
        update: {},
        create: {
          QuestionId: question.id,
          LabelId: label.id,
        },
      });
    }
  }

  async startSpider() {
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: {
        width: 0,
        height: 0,
      },
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: '/usr/bin/google-chrome',
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
    // 存储所有面试问题
    const allInterviewQuestions = [];
    for (let i = 1; i <= totalPage; i++) {
      await page.goto(
        `https://github.com/pro-collection/interview-question/issues?page=${i}&q=is%3Aissue+is%3Aopen`,
      );

      await page.waitForSelector('.js-navigation-container');

      const questions = await page.$eval('.js-navigation-container', (el) => {
        return [...el.querySelectorAll('.Box-row')].map((item) => {
          return {
            issueId: parseInt(item.id.split('_')[1]),
            title: item.querySelector('.Link--primary').textContent,
            labels: [...item.querySelectorAll('.lh-default a')].map((el) =>
              el.textContent.trim(),
            ),
            level: item
              .querySelector('.issue-milestone .css-truncate-target')
              .textContent.trim(),
            link: (item.querySelector('a.Link--primary') as HTMLAnchorElement)
              .href,
          };
        });
      });
      allInterviewQuestions.push(...questions);
    }

    // 获取题目回答
    for (let i = 0; i < allInterviewQuestions.length; i++) {
      await page.goto(allInterviewQuestions[i].link);

      try {
        await page.waitForSelector('.comment-body');

        const commentHtmlString = await page.$eval(
          '.comment-body',
          (el) => el.outerHTML,
        );

        const turndownService = new TurndownService();
        const markdown = turndownService.turndown(commentHtmlString);

        allInterviewQuestions[i].answer = markdown;

        // console.log(allJobs[i]);
      } catch (e) {
        console.log(
          '🚀 ~ file: app.service.ts ~ line 130 ~ AppService ~ startSpider ~ e',
          e,
        );
      }
    }

    // 保存数据
    for (let i = 0; i < allInterviewQuestions.length; i++) {
      const question = allInterviewQuestions[i];
      await this.upsertQuestionWithLabels(question);
    }
  }

  async list() {
    return await this.prismaService.question.findMany({
      include: {
        labels: true,
      },
    });
  }
}
