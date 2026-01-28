---
  title: Automatic PDF Renaming with Local AI
  date: 2026-01-28T23:30:26.411+01:00
  tags: ["hazel","automation","ai"]
  permalink: /blog/automatic-pdf-renaming-with-local-ai/index.html
summary: "A practical guide to automating PDF renaming using local AI models with Ollama. Learn how to set up a privacy-preserving paperless workflow that automatically renames scanned documents based on their content and imports them into DEVONthink — all without sending sensitive data to the cloud."
_social_post: "How I built a privacy-preserving paperless workflow using local AI.
Ollama + ai-pdf-renamer + Hazel = automatic document renaming without sending sensitive data to the cloud."
---

Last year we moved into our house and with that I (once again) touched a lot of old paper stuff that I really don't want to keep physically anymore. I am 99.9% paperless for many years; every document I receive gets scanned with a ScanSnap iX100 (the Software is not great but scanning works fine for the amount of documents I receive) and properly filed into DEVONthink.

Additionally a lot of important documents from the house and renovations are piling up that I want to have in my database to be searchable and backed up.

I don't want to spend the time to scan each document and rename it to the detail I do with newer documents - I can rely on OCRed PDFs with great search in DEVONthink for these old things. So I searched for a solution to do automatic renaming.

[Claude Cowork](https://claude.com/product/cowork) is an obvious candidate but since there are also a lot of (very) private data (from addresses and bank data to medical files) within that stuff I quickly decided that this had to happen on device and not send that data to any cloud for processing. I use [Hazel](https://www.noodlesoft.com) to perform rule based file management and renaming for certain files but this is way too static for this kind of use case.

After some research I found the cli tool [ai-pdf-renamer](https://github.com/wunderkind2k1/ai-pdf-renamer) by Sven Hohlfeld on GitHub. This seemed to be a good fit since I could use local AI models running with [Ollama](https://ollama.com) to rename files based on their contents with some possibilities to customize it via command line flags.

After installing Ollama (again) and pulling a few models, I downloaded the tool and tried it with some test documents with _Decent_ results on the [Ticci Scale](https://512pixels.net/wp-content/uploads/2025/12/Ticci-Scale.jpg). 

First thing to customize was switching from the _Vision_ to _OCR Mode_ for the processing which this was way faster and improved results slightly for me. Next I iterated on a custom prompt that can be passed to the tool as argument. Here is my final prompt (just exchanged the examples to English ones):

```text
Rename this PDF file. Reply with ONLY the filename, nothing else.

Format: YYYY-MM-DD keywords

Rules:
- Start with the document date in YYYY-MM-DD format
- Follow with 2-4 important keywords (company name, document type, topic)
- Separate all parts with spaces
- No file extension needed
- Suggest names in GERMAN if the content of the document is also in german.

Examples
- 2024-03-15 Apple Invoice MacBook
- 2023-11-02 Taxes 2022
- 2024-01-20 [Company Name] Contract Mobile
```

With the custom prompt, the results went up to _Normal_ with a few exceptions in the _Inferior_ range when the LLM decided to ignore my prompt and describe the document. However the names were often cut off too early since the current version of the tool has a hard-coded limit of 64 characters for the file name which can't be configured. To solve that I cloned the repository, changed the implementation locally, doubled the character limit, and built it again with `go`.

Now I am getting mostly _Good_ filenames from the tool, and I probably need to experiment a bit more with different models in Ollama that might improve results (using 'llama3.2:latest' for now) but for now I am pleased with _Good Enough_ filenames for a lot of incoming scans.

The final step was now to automate triggering the tool with a given file and importing the renamed one into DEVONthink. Fortunately Hazel is perfect for that. I created a rule that is triggered when a file gets tagged "AI". It calls the tool with the following embedded shell script:

```bash
./ai-pdf-renamer --prompt "Rename this PDF file. Reply with ONLY the filename, nothing else.\n\nFormat: YYYY-MM-DD keywords\n\nRules:\n- Start with the document date in YYYY-MM-DD format\n- Follow with 2-4 important keywords (company name, document type, topic)\n- Separate all parts with spaces\n- No file extension needed\n- Suggest names in GERMAN if the content of the document is also in german.\n\nExamples:\n2024-03-15 Amazon Invoice MacBook\n2023-11-02 Taxes 2022\n2024-01-20 [Company Name] Contract Mobile" --model llama3.2:latest --output renamed/ --auto --novision $1
```

The renamed file then gets moved to the Inbox folder of DEVONthink and is automatically imported. 

I'll probably extend this by automatically moving those files into a group dedicated for "old and unsorted" stuff.