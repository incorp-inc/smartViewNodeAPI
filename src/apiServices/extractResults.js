const axios = require('axios');
module.exports.extractResult = async (fileID, res) => {
    let data = JSON.stringify({
        "fileID": fileID,
        "type": "DEFAULT"
      });

    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://ml.vakilsearch.com/invoice/extract/results',
        headers: { 
            'Accept': 'application/json, text/plain, */*', 
            'Accept-Language': 'en-US,en;q=0.9', 
            'Connection': 'keep-alive', 
            'Content-Type': 'application/json', 
            'Cookie': '__Host-next-auth.csrf-token=ce612c42655b08fb306246ed50a09fcf657346608245c33cb9fca48ef6b91ede%7Cc5481bff35bb3b30583f802c79aa1ebe7594543735315fe1912f518036c2735b; vs-smarti._km_id-7c90be7e6d6d382a795bdf96fad66599=jzLltb1zkeP7Qd4bIBLm6iPlVpWAE74K; vs-smarti._km_user_name-7c90be7e6d6d382a795bdf96fad66599=; vs-smarti._km_lead_collection-7c90be7e6d6d382a795bdf96fad66599=false; invoice_ids=NjY0Y2E4ZWQzMzQ3ODFjNjkyN2QxNjFjLDY2NGNhNmU1MzM0NzgxYzY5MjdkMTYxOSw2NjRjYTVkNzMzNDc4MWM2OTI3ZDE2MTY=; __Secure-next-auth.callback-url=https%3A%2F%2Fvs-smarti.vakilsearch.com%2Flogin%3FcallbackUrl%3Dhttps%253A%252F%252Fvs-smarti.vakilsearch.com%252Fdashboard%253FsortBy%253DuploadedAt%2526sortCondition%253D-1; accessToken=YHHK0PIVGEK7F3PJCGWKO493514DRSQS; __Secure-next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..OPTc5WHwBBEghra3.MqnBMLyVex2Bma1AlraUhd4RsIdW8dPZHuORAsG7Tsoyh74jJs9rUreT51yc_aYUdbe98_UJGAZRmaQbvQhv73FpBHYLjKlD65s6RYQAGUo7zqQ8yUKS1uEXQjQMHWnmKq1mTXFou4ruiLPb-gCOQLZvj0ZyMm9RCEH8C18MAlWK8NSrkboUVkCcoIaCSP9Jzy2N5tKAYRBRU2TN8x8vghRuKok-rvKBCIy4MuuK-yuEdn_ePFtn7oRt9aw2l9BUGh3KqRAhcMCtRMR5ulHYbR96ueAGS_IMi0q5MVaVe25VcTagcUGtrjKIxU5gq5iQ360_qN-_JZnuYYF_ho7LVkIi24qIuQZ78FS5Uyv0Jsst9UqB8COd1WZITe0OhNGjViDwlDVrIUKREpuVwWq5b0hfy7qM440oEiRDMfELpRWosIKY8T71UXOijMsPUUN8z3hjZsnSioqSvJEQQwW5zaNKisHIXfpj2iqaxhe6QUO89RoSfJQHJ_IGmVrZmmFGt2g19GkiUd-yZpBE-qTqHC-ny5MI9Q0NMEnn9TcHEjqXjFZ9XWUtvD-YQnXUJYenkOXA0m8ltk-b75to1XsVQPD4ZQdLM5-uLxzYjAk.NXIymJkaSRUoIAxMRbxTew', 
            'Origin': 'https://vs-smarti.vakilsearch.com', 
            'Referer': 'https://vs-smarti.vakilsearch.com/invoice?file=664ca8ed334781c6927d161c&sortBy=uploadedAt&sortCondition=-1', 
            'Sec-Fetch-Dest': 'empty', 
            'Sec-Fetch-Mode': 'cors', 
            'Sec-Fetch-Site': 'same-origin', 
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', 
            'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"', 
            'sec-ch-ua-mobile': '?0', 
            'sec-ch-ua-platform': '"macOS"', 
            'authorization': 'Bearer o7SThDlkGXsp0Y41ZjyqQ3gBrURM8zf9', 
            'accessToken': 'YHHK0PIVGEK7F3PJCGWKO493514DRSQS'
          },
          data : data
        };

    try {
        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
        res.json(response.data);
    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            res.status(500).send('An error occurred while extracting the results');
        }
    }
}