import { AskRequest, AskResponse, ChatRequest, ChatResponse } from "./models";
export const qaUrl = `${import.meta.env.VITE_QA_URL}`
export const chatUrl = `${import.meta.env.VITE_CHAT_URL}`

export async function askApi(options: AskRequest, indexNs: string, indexType: string, chainType : string): Promise<AskResponse> {
    const url = qaUrl + "&chainType=" + chainType
    + "&question=" + options.question + "&indexType=" + indexType + "&indexNs=" + indexNs;
    // const url = "http://localhost:7071/api/QuestionAnswering?chainType=" + chainType
    // + "&question=" + options.question + "&indexType=" + indexType + "&indexNs=" + indexNs;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify( {
            values: [
              {
                recordId: 0,
                data: {
                  text: ''
                }
              }
            ]
          })
        // body: JSON.stringify({
        //     question: options.question,
        //     approach: options.approach,
        //     overrides: {
        //         semantic_ranker: options.overrides?.semanticRanker,
        //         semantic_captions: options.overrides?.semanticCaptions,
        //         top: options.overrides?.top,
        //         temperature: options.overrides?.temperature,
        //         prompt_template: options.overrides?.promptTemplate,
        //         prompt_template_prefix: options.overrides?.promptTemplatePrefix,
        //         prompt_template_suffix: options.overrides?.promptTemplateSuffix,
        //         exclude_category: options.overrides?.excludeCategory
        //     }
        // })
    });

    const parsedResponse: ChatResponse = await response.json();
    if (response.status > 299 || !response.ok) {
        throw Error("Unknown error");
    }
    return parsedResponse.values[0].data

}

export async function chatApi(options: ChatRequest, indexNs: string, indexType:string): Promise<AskResponse> {
    const response = await fetch(chatUrl + "&indexNs=" + indexNs + "&indexType=" + indexType , {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          values: [
            {
              recordId: 0,
              data: {
                history: options.history,
                approach: 'rrr',
                overrides: {
                  semantic_ranker: true,
                  semantic_captions: false,
                  top: 3,
                  suggest_followup_questions: false
                }
              }
            }
          ]
        })
        // body: JSON.stringify({
        //     history: options.history,
        //     approach: options.approach,
        //     overrides: {
        //         semantic_ranker: options.overrides?.semanticRanker,
        //         semantic_captions: options.overrides?.semanticCaptions,
        //         top: options.overrides?.top,
        //         temperature: options.overrides?.temperature,
        //         prompt_template: options.overrides?.promptTemplate,
        //         prompt_template_prefix: options.overrides?.promptTemplatePrefix,
        //         prompt_template_suffix: options.overrides?.promptTemplateSuffix,
        //         exclude_category: options.overrides?.excludeCategory,
        //         suggest_followup_questions: options.overrides?.suggestFollowupQuestions
        //     }
        // })
    });

    const parsedResponse: ChatResponse = await response.json();
    if (response.status > 299 || !response.ok) {
        throw Error(parsedResponse.values[0].data.error || "Unknown error");
    }
    return parsedResponse.values[0].data;
}

export function getCitationFilePath(citation: string): string {
    return `/content/${citation}`;
}