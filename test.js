fetch("https://photos.google.com/_/upload/uploadmedia/interactive?authuser=0", {
  headers: {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    "sec-ch-ua": '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
    "sec-ch-ua-arch": '"x86"',
    "sec-ch-ua-bitness": '"64"',
    "sec-ch-ua-full-version": '"119.0.6045.200"',
    "sec-ch-ua-full-version-list": '"Google Chrome";v="119.0.6045.200", "Chromium";v="119.0.6045.200", "Not?A_Brand";v="24.0.0.0"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-model": '""',
    "sec-ch-ua-platform": '"Windows"',
    "sec-ch-ua-platform-version": '"10.0.0"',
    "sec-ch-ua-wow64": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-client-data": "CKm1yQEIhrbJAQiktskBCKmdygEIufnKAQiSocsBCPyqzAEIhaDNAQjcvc0BCKbczQEIz9/NAQjb480BCLPpzQEI3ezNARiPzs0BGKfqzQEY9ezNAQ==",
    "x-goog-hash": "sha1=G5nI3irFMzjeVZlp+mfpfE+9kN8=",
    "x-goog-upload-command": "start",
    "x-goog-upload-file-name": "yanp2p_18.png",
    "x-goog-upload-header-content-length": "802096",
    "x-goog-upload-protocol": "resumable",
    cookie:
      "__Secure-ENID=15.SE=nupkMFna_qoE1Qo_usXiHZeRuiqEWk8mNasA5HbM5gzpJuSZ5d3VVMltBtjBD56UUq0MYZAsp1hcE8DDqZjDXZd-zFnqhTOk88faPWU_ohSFNFux5YguAsZWh8KDdl86F6PLKUaXjcZzYwBcXMYTbAgQ84fYFpejko_NI3zLeX3RlABrY1_leIw3xAehlo2XvKGs2zappZarIUqHCK4BIA2oKbKtI_nus2KvGY2J-m0Roc4fo_0eW1L6AsvbiqxF33xdOBlJC9hI9WqgX84o_fNBjylKSz2YFMgFWeGTeJEH1PFtELQQZfj1; OTZ=7295369_28_28__28_; SID=dwgeiLAiBArSOlYst0y1OuC_4Xd9njg_H0Hlr1eZbsJJkC3V53AkyUl0Jwjb8ntVveaoEQ.; __Secure-1PSID=dwgeiLAiBArSOlYst0y1OuC_4Xd9njg_H0Hlr1eZbsJJkC3VH9YaXLn1xl2ieJ0K1roGiA.; __Secure-3PSID=dwgeiLAiBArSOlYst0y1OuC_4Xd9njg_H0Hlr1eZbsJJkC3VPBHfiftEkFPs_qQjLj3Fug.; HSID=AF1qdryCe_q52MLw6; SSID=A8HcvUbPgcOXOBxRl; APISID=L-V02BHooY9b65Ee/AE4jBqvY5tnvovYwk; SAPISID=6kNje3gd3PVw3tXq/A_uFo6gH3UAz_9-AW; __Secure-1PAPISID=6kNje3gd3PVw3tXq/A_uFo6gH3UAz_9-AW; __Secure-3PAPISID=6kNje3gd3PVw3tXq/A_uFo6gH3UAz_9-AW; OSID=dwgeiDldJ_aRgzyKb3zEpesncgsCgZjWxE0VDu-SqYlHFmy3k-Nf4nfKplyITlB-QvyzJA.; __Secure-OSID=dwgeiDldJ_aRgzyKb3zEpesncgsCgZjWxE0VDu-SqYlHFmy3-AVLg2y6lhSoDSV-ZOAaSw.; AEC=Ackid1RpqVILL7VdSTLPEzoMfpqxsfk9_eP8Tb8ZhZOLnWtczZgzBiuv2Kg; S=billing-ui-v3=7d5T1zCJXUs6e5JhBY6SEFdz5DwWZXaY:billing-ui-v3-efe=7d5T1zCJXUs6e5JhBY6SEFdz5DwWZXaY; COMPASS=photos-ui=CgAQ3KGsqwYaVwAJa4lXCXN98Xkl60aiCB0wEpwuNaK8NvIPQmGfBwejdMqXeflypvQhpL6qaBLUC2w9AQxC2anK7myk2mxLCBsu2cREvKqSFYjxfe_sTnRmKq9CfwL_6DAB; NID=511=S4SPKcM06l6Xhu7R6LjThRFKHnTOrZXqsjfdYh2abV12aNciPfNuC1AsRNwCMGs1oaylZcHzJCtNVs-NN9cxclTsX35n-JnXYxrwDnpjIcolCkXUNcpuSoQ-ChzgA5RQh3UFPOXuJu7H63Qp6NOTrswTpzQ8bWxkAeA8pIzSO4V8yLeiePaNgQ_fz1ce2aA0NH3Nh3ibVeyY6RGkVzNATjaE_yAnYemhR8zETYzlkevhZ8wWaLThML7fwKg7ScymijSR--UEkw3I6CjsTg_SoW1oxf4W9o3o1JOMxwn_Gy0Gl7AZ6TD7qWAZE_uP_FvHITMZ3Qn9AyDNUetmQlm1Zffzcal0Iuq46DwMLXTfMsd01QtMs94ycaBUc9faMUWjA57vlSw-WnN5GMVlwyDfwuI8eNLYKS5exLGBNyK1ZKNiIEsI3HaosRL1UDFnbQuKBxmm7v-F2u80vNHUD-WEu7r9FN54A3SbS41fEudVnESrZAPRoCMkzXMK-7IkIJiZ77BsXc5M5pSFz2-QwonBTLpqq3xDqjmrYf8bx1CS_sphW9EXNa1No-BHZ3buCgfIPwK0pa_vTSLa3B5ojy3od71aLA; __Secure-1PSIDTS=sidts-CjEBPVxjSn4LNVcAcKLFCllH9W7tEFWJ9kPqizZO5qz6ftpxDQpLEkwYLTsRLFHV3ehpEAA; __Secure-3PSIDTS=sidts-CjEBPVxjSn4LNVcAcKLFCllH9W7tEFWJ9kPqizZO5qz6ftpxDQpLEkwYLTsRLFHV3ehpEAA; SEARCH_SAMESITE=CgQI7ZkB; 1P_JAR=2023-12-2-10; SIDCC=ACA-OxOfsK-6E_391VqTwflVTTmiT0DTNutQ2AP_hmM74PD9HgkbykFjop1BI7w13Te93gx-JU0; __Secure-1PSIDCC=ACA-OxOxpsTApU8zgYkmLs2clKaeZeSd5XLj1luDurMwIQYDyJeyLLQWi8X1GF9LAOv4Ag_MFhQ; __Secure-3PSIDCC=ACA-OxMHm-9tjbU7vD9Lr16pZLNPlROJGuBA_W7ntIot_DXX_Ub4jJ82fcHWKgQDS58mRlSRSOT6",
    Referer: "https://photos.google.com/",
    "Referrer-Policy": "origin",
  },
  body: "\b\u0002\u0010\u0001\u0018\u0001 \u00028°ú0@\u0001",
  method: "POST",
}).then((response) => {
  const headers = response.headers;
  headers.forEach((value, name) => {
    console.log(`${name}: ${value}`);
  });
  return response;
});
