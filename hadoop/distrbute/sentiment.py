from transformers import DistilBertConfig, DistilBertTokenizer, DistilBertForSequenceClassification
from transformers import XLMRobertaConfig, XLMRobertaForSequenceClassification, XLMRobertaTokenizer
import torch
import sentencepiece as spm

def vad_calculate(sentence):
    #directory = "/usr/local/XLM-RoBERTa-base_MSE/"
    #directory = "C:/Users/SSAFY/Downloads/DistilBERT MSE/DistilBERT MSE/"
    directory = "./utils/"

    output_model_file = directory + "pytorch_model.bin"
    output_config_file = directory + "config.json"
    output_vocab_file = directory + "vocab.txt"

    # config = DistilBertConfig.from_json_file(output_config_file)
    # model = DistilBertForSequenceClassification(config)
    # state_dict = torch.load(output_model_file, map_location=torch.device('cpu'))
    # model.load_state_dict(state_dict, strict=False)
    # tokenizer = DistilBertTokenizer(output_vocab_file)

    config = XLMRobertaConfig.from_json_file(output_config_file)
    model = XLMRobertaForSequenceClassification(config)
    state_dict = torch.load(output_model_file, map_location=torch.device('cpu'))
    model.load_state_dict(state_dict, strict=False)
    #tokenizer = DistilBertTokenizer(output_vocab_file)
    tokenizer = XLMRobertaTokenizer.from_pretrained("xlm-roberta-base")

    #입력 문장
    # sentences = [
    #     "오늘은 안돼요 내 사랑이 이대로는 이별을 감당하긴 어려운걸요 많은 약속을 다 지울 순 없잖아요 아직도 해드릴게 참 많이 있는데",
    #     "좋아! 네 모든 것이 좋아 머리부터 발끝까지도 조그만 행동까지 하나 하나 다 좋아 네 모든 것이 좋아 너와 함께라면 즐거워 시간이 지날수록 더 좋아져!"
    # ]

    # Tokenize the input
    inputs = tokenizer.encode_plus(sentence, add_special_tokens=True, return_tensors="pt", truncation=True,
                                   padding=True)

    result = model.forward(inputs['input_ids'], inputs['attention_mask'])

    # Apply softmax to get probabilities
    #probabilities = torch.sigmoid(logits)
    # probabilities = torch.nn.functional.hardsigmoid(result.logits)
    probabilities = torch.nn.functional.sigmoid(result.logits)

    # Convert probabilities to numpy array
    # probabilities = probabilities.cpu().numpy()

    return probabilities[0][0].item(), probabilities[0][1].item()
