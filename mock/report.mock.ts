import { defineMock } from "./base";

export default defineMock([
  // 根据测评记录ID获取报告
  {
    url: "/api/v1/report/record/:recordId",
    method: ["GET"],
    body: ({ params }: { params: { recordId: string } }) => {
      const recordId = parseInt(params.recordId);

      // 模拟不同的报告数据
      const reports: Record<number, any> = {
        1: {
          id: 1,
          recordId: 1,
          userId: 1,
          userName: "张三",
          scaleId: 1,
          scaleName: "焦虑抑郁量表",
          versionName: "v2.0",
          totalScore: 85.5,
          totalQuestions: 10,
          completionRate: 100.0,
          durationSecond: 320,
          resultLevel: "中度",
          dimensionScores: [
            {
              dimensionName: "焦虑维度",
              score: 45,
              maxScore: 60,
              scoreRate: 75.0,
              level: "中度",
              description:
                "您在焦虑维度的得分为45分(满分60分)，处于中度焦虑水平。这表明您目前存在一定程度的焦虑情绪，可能会影响日常生活和工作。建议关注自己的情绪变化，适当寻求专业帮助。",
            },
            {
              dimensionName: "抑郁维度",
              score: 25,
              maxScore: 40,
              scoreRate: 62.5,
              level: "轻度",
              description:
                "您在抑郁维度的得分为25分(满分40分)，处于轻度抑郁水平。这提示您可能有轻微的情绪低落倾向，但还在可控范围内。建议保持良好的作息习惯，多参与社交活动。",
            },
            {
              dimensionName: "压力维度",
              score: 15.5,
              maxScore: 20,
              scoreRate: 77.5,
              level: "中度",
              description:
                "您在压力维度的得分为15.5分(满分20分)，处于中度压力水平。当前压力水平较高，建议学习压力管理技巧，适当放松身心，保持工作生活平衡。",
            },
          ],
          suggestion:
            "根据您的测评结果，建议您：\n\n1. 调整作息时间，保证充足的睡眠(每天7-8小时)\n2. 每天进行30分钟以上的有氧运动，如散步、慢跑等\n3. 学习放松技巧，如深呼吸、冥想、渐进性肌肉放松等\n4. 与家人朋友保持良好沟通，寻求社会支持\n5. 如果症状持续或加重，建议及时寻求专业心理咨询师或精神科医生的帮助\n\n记住，心理健康和身体健康同样重要，关注自己的情绪变化，及时调整，才能保持身心健康。",
          createTime: "2024-10-29 15:30:00",
        },
        2: {
          id: 2,
          recordId: 2,
          userId: 1,
          userName: "张三",
          scaleId: 1,
          scaleName: "心理健康评估量表",
          versionName: "v1.0",
          totalScore: 42.0,
          totalQuestions: 15,
          completionRate: 100.0,
          durationSecond: 480,
          resultLevel: "正常",
          dimensionScores: [
            {
              dimensionName: "情绪稳定性",
              score: 18,
              maxScore: 20,
              scoreRate: 90.0,
              level: "优秀",
              description:
                "您的情绪稳定性非常好，能够很好地控制和调节自己的情绪。继续保持这种良好的状态。",
            },
            {
              dimensionName: "社交能力",
              score: 14,
              maxScore: 20,
              scoreRate: 70.0,
              level: "良好",
              description:
                "您具备良好的社交能力，能够较好地与他人建立和维持关系。适当扩大社交圈会更好。",
            },
            {
              dimensionName: "应对能力",
              score: 10,
              maxScore: 15,
              scoreRate: 66.7,
              level: "良好",
              description:
                "您面对压力和挑战时有一定的应对能力，但还有提升空间。建议学习更多应对策略。",
            },
          ],
          suggestion:
            "恭喜您！您的心理健康状况良好。建议：\n\n1. 继续保持当前良好的生活习惯和心态\n2. 适当参与社交活动，扩大人际交往圈\n3. 定期进行自我反思和心理调适\n4. 学习新的应对压力的方法和技巧\n5. 保持积极乐观的生活态度\n\n您的心理韧性较强，继续保持！",
          createTime: "2024-10-28 10:15:00",
        },
        3: {
          id: 3,
          recordId: 3,
          userId: 1,
          userName: "张三",
          scaleId: 2,
          scaleName: "职业倦怠量表",
          versionName: "v1.5",
          totalScore: 92.0,
          totalQuestions: 20,
          completionRate: 100.0,
          durationSecond: 600,
          resultLevel: "高风险",
          dimensionScores: [
            {
              dimensionName: "情绪耗竭",
              score: 38,
              maxScore: 40,
              scoreRate: 95.0,
              level: "重度",
              description:
                "您的情绪耗竭程度很高，这表明您在工作中感到精疲力竭、身心俱疲。这是职业倦怠的核心症状，需要引起高度重视。",
            },
            {
              dimensionName: "去人格化",
              score: 28,
              maxScore: 30,
              scoreRate: 93.3,
              level: "重度",
              description:
                "您对工作和他人表现出冷漠、疏离的态度。这可能会影响您的工作质量和人际关系，建议及时调整。",
            },
            {
              dimensionName: "个人成就感",
              score: 26,
              maxScore: 30,
              scoreRate: 86.7,
              level: "低",
              description:
                "您的个人成就感较低，对自己的工作价值和能力持怀疑态度。建议重新审视自己的优势和成就。",
            },
          ],
          suggestion:
            "您的职业倦怠程度较高，强烈建议：\n\n1. 立即安排休假，给自己一段时间充分休息和恢复\n2. 寻求专业心理咨询，进行系统的心理干预\n3. 重新评估当前工作，考虑是否需要调整工作内容或方式\n4. 建立工作和生活的明确界限，避免过度投入\n5. 培养工作之外的兴趣爱好，丰富生活内容\n6. 学习压力管理和情绪调节技巧\n7. 与上级沟通工作量和工作要求，寻求支持\n\n职业倦怠是可以改善的，但需要您主动采取行动。必要时请寻求专业帮助。",
          createTime: "2024-10-27 14:20:00",
        },
      };

      // 如果有对应的报告数据，返回；否则返回默认数据
      const report = reports[recordId] || {
        id: recordId,
        recordId,
        userId: 1,
        userName: "测试用户",
        scaleId: 1,
        scaleName: "心理测评量表",
        versionName: "v1.0",
        totalScore: 60.0,
        totalQuestions: 10,
        completionRate: 100.0,
        durationSecond: 300,
        resultLevel: "正常",
        dimensionScores: [
          {
            dimensionName: "综合维度",
            score: 60,
            maxScore: 100,
            scoreRate: 60.0,
            level: "正常",
            description: "您的综合得分处于正常范围，整体状况良好。",
          },
        ],
        suggestion: "您的测评结果显示整体状况良好。建议继续保持良好的生活习惯，注意身心健康。",
        createTime: new Date().toISOString().slice(0, 19).replace("T", " "),
      };

      return {
        code: "00000",
        data: report,
        msg: "Success",
      };
    },
  },
]);
