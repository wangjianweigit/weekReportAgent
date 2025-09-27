import { Application, Router } from "oak";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

const app = new Application();
const router = new Router();


// 智能周报生成器类
class SmartWeeklyReportGenerator {
  // 生成智能周报
  generateSmartReport(input: string): string {
    // 按句号分割，然后分析每句话
    const sentences = input.split(/[。！？]/).filter(s => s.trim());
    
    const workItems: any[] = [];
    const problems: any[] = [];
    const plans: any[] = [];

    sentences.forEach(sentence => {
      const trimmed = sentence.trim();
      if (!trimmed) return;

      if (this.isWorkSentence(trimmed)) {
        workItems.push(this.parseWorkSentence(trimmed));
      } else if (this.isProblemSentence(trimmed)) {
        problems.push(this.parseProblemSentence(trimmed));
      } else if (this.isPlanSentence(trimmed)) {
        plans.push(this.parsePlanSentence(trimmed));
      }
    });

    return this.generateFormattedReport(workItems, problems, plans);
  }

  private isWorkSentence(sentence: string): boolean {
    const workKeywords = ['完成', '实现', '开发', '修复', '优化', '参与', '进行', '执行', '交付', '制作', '设计', '编写'];
    return workKeywords.some(keyword => sentence.includes(keyword));
  }

  private isProblemSentence(sentence: string): boolean {
    const problemKeywords = ['遇到', '问题', '困难', '挑战', 'bug', '错误', '故障', '异常', '阻碍', '延迟'];
    return problemKeywords.some(keyword => sentence.includes(keyword));
  }

  private isPlanSentence(sentence: string): boolean {
    const planKeywords = ['下周', '计划', '准备', '将要', '打算', '目标', '预期', '开始', '启动'];
    return planKeywords.some(keyword => sentence.includes(keyword));
  }

  private parseWorkSentence(sentence: string): any {
    // 提取时间
    const timeMatch = sentence.match(/(\d+)\s*(天|小时|周|月)/);
    const time = timeMatch ? `${timeMatch[1]}${timeMatch[2]}` : '未指定';

    // 提取任务描述
    let task = sentence
      .replace(/[，,]\s*花了?\s*\d+\s*(天|小时|周|月)/g, '')
      .replace(/[，,]\s*耗时\s*\d+\s*(天|小时|周|月)/g, '')
      .replace(/[，,]\s*用了?\s*\d+\s*(天|小时|周|月)/g, '')
      .trim();

    // 提取成果
    const resultMatch = sentence.match(/[，,]\s*(实现了|完成了|开发了|修复了|优化了|提升了|增加了|改善了|提出了|参与了|进行了|执行了|制作了|设计了|编写了|交付了)(.+?)(?=[，,。]|$)/);
    const result = resultMatch ? `${resultMatch[1]}${resultMatch[2]}` : sentence;

    return { task, time, result };
  }

  private parseProblemSentence(sentence: string): any {
    return {
      description: sentence,
      impact: '轻微影响进度',
      progress: '已协调解决'
    };
  }

  private parsePlanSentence(sentence: string): any {
    return {
      task: sentence,
      goal: '按计划推进'
    };
  }

  private generateFormattedReport(workItems: any[], problems: any[], plans: any[]): string {
    const summary = this.generateSummary(workItems, problems);
    const achievements = this.generateAchievements(workItems);
    const detailedWork = this.generateDetailedWork(workItems);
    const problemSection = this.generateProblemSection(problems);
    const nextWeek = this.generateNextWeek(plans);

    return `${summary}\n\n${achievements}\n\n${detailedWork}\n\n${problemSection}\n\n${nextWeek}`;
  }

  private generateSummary(workItems: any[], problems: any[]): string {
    let summary = "【本周概要】";
    
    if (workItems.length > 0) {
      summary += `本周主要完成了${workItems.length}项核心工作`;
      if (workItems.length > 1) {
        summary += `，包括${workItems[0].task}等重点工作`;
      }
    }
    
    if (problems.length > 0) {
      summary += `，积极应对并解决了${problems.length}个关键问题`;
    }
    
    summary += "，确保了项目整体进度的顺利推进，为团队目标的实现贡献了重要力量。";
    
    return summary;
  }

  private generateAchievements(workItems: any[]): string {
    let achievements = "【主要成果】\n";
    
    workItems.forEach((item, index) => {
      achievements += `${index + 1}. ${item.result}\n`;
    });
    
    return achievements;
  }

  private generateDetailedWork(workItems: any[]): string {
    let work = "【详细工作】\n\n";
    
    if (workItems.length > 0) {
      work += "• 重点事项：";
      const mainTask = workItems[0];
      work += `${mainTask.task}（${mainTask.time}）- ${mainTask.result}\n`;
    }
    
    if (workItems.length > 1) {
      work += "• 日常事项：";
      const otherTasks = workItems.slice(1);
      work += otherTasks.map(task => `${task.task}（${task.time}）`).join("、");
      work += "\n";
    }
    
    return work;
  }

  private generateProblemSection(problems: any[]): string {
    let problemSection = "【问题与复盘】\n";
    
    if (problems.length === 0) {
      problemSection += "本周工作进展顺利，各项任务按计划推进，未遇到重大技术难题或阻碍。";
    } else {
      problems.forEach(problem => {
        problemSection += `${problem.description}，通过${problem.progress}，${problem.impact}。\n`;
      });
      
      problemSection += "\n通过积极的问题解决态度和团队协作，确保了项目进度的稳定推进。";
    }
    
    return problemSection;
  }

  private generateNextWeek(plans: any[]): string {
    let nextWeek = "【下周计划】\n";
    
    if (plans.length === 0) {
      nextWeek += "1. 继续推进当前项目进度\n";
      nextWeek += "2. 优化工作流程，提升效率\n";
      nextWeek += "3. 加强团队协作，确保项目质量";
    } else {
      plans.forEach((plan, index) => {
        nextWeek += `${index + 1}. ${plan.task}（${plan.goal}）\n`;
      });
    }
    
    return nextWeek;
  }
}

// 静态文件服务中间件
async function serveStaticFiles(ctx: any, next: any) {
  const url = new URL(ctx.request.url);
  const pathname = url.pathname;
  
  if (pathname === "/") {
    const file = await Deno.readTextFile("./public/index.html");
    ctx.response.headers.set("Content-Type", "text/html; charset=utf-8");
    ctx.response.body = file;
  } else if (pathname.startsWith("/static/")) {
    const filePath = pathname.replace("/static/", "./public/");
    try {
      const file = await Deno.readTextFile(filePath);
      const ext = filePath.split('.').pop();
      const contentType = ext === 'css' ? 'text/css' : 
                         ext === 'js' ? 'application/javascript' : 
                         'text/plain';
      ctx.response.headers.set("Content-Type", contentType);
      ctx.response.body = file;
    } catch {
      ctx.response.status = 404;
      ctx.response.body = "File not found";
    }
  } else {
    await next();
  }
}

// 智能API路由
router.post("/api/generate-smart", async (ctx) => {
  try {
    const body = await ctx.request.body().value;
    let data: any;
    
    if (typeof body === 'string') {
      data = JSON.parse(body);
    } else {
      data = body;
    }
    
    const generator = new SmartWeeklyReportGenerator();
    const report = generator.generateSmartReport(data.input);
    
    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.body = JSON.stringify({ 
      success: true, 
      report: report 
    });
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// 兼容旧版API
router.post("/api/generate", async (ctx) => {
  try {
    const body = await ctx.request.body().value;
    let data: any;
    
    if (typeof body === 'string') {
      data = JSON.parse(body);
    } else {
      data = body;
    }
    
    const generator = new SmartWeeklyReportGenerator();
    const report = generator.generateFormattedReport(
      data.completed || [],
      data.problems || [],
      data.plans || []
    );
    
    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.body = JSON.stringify({ 
      success: true, 
      report: report 
    });
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// 使用CORS中间件
app.use(oakCors());

// 使用静态文件服务
app.use(serveStaticFiles);

app.use(router.routes());
app.use(router.allowedMethods());

const port = Deno.env.get("PORT") || "8000";
console.log(`🚀 智能周报生成器运行在 http://localhost:${port}`);
await app.listen({ port: parseInt(port) });
