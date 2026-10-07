---
title: "Building real-time Lebanese Sign Language translation"
description: "Lebanese Sign Language has a data problem before it has a model problem."
canonical_url: https://ramikronbi.com/writing/building-real-time-lebanese-sign-language-translation
cover_image: https://ramikronbi.com/images/vneo/rami-kronbi-card.jpg
tags: computervision, edgeai, embedded
published: false
---
Lebanese Sign Language has a data problem before it has a model problem. General sign-language datasets do not automatically transfer to local vocabulary, signing patterns, or the communication settings in which a system will be used.

OmniSign is a real-time translation system spanning camera input, visual recognition, language output, and deployment across mobile, web, and offline embedded environments. We built a 300,000-image dataset, reached 95–97% accuracy in development at roughly 45 frames per second, and piloted it in two Beirut coffee shops and one church.

The team’s project page gives different numbers: 40,000 sign samples collected from 21 Lebanese sign-language schools, 50,000 after augmentation, and 80,000 landmark records. We collected the dataset ourselves, and the counts differ because they measure different things, samples versus images.

The important engineering question is not only whether a classifier recognizes a held-out image. A usable translator must remain responsive across different signers, backgrounds, cameras, lighting, and signing speeds. Dataset balance and consent matter. So do uncertainty handling and the decision to ask for a repeated sign instead of producing a confident wrong translation.

OmniSign was a team project. Layth Ayache led the AI and data work; Nour El Hariri, Tayseer Laz, and Abou Baker Hussien Al Khatib were on the team; Dr. Oussama Mustapha supervised; I was a co-founder and the computer vision engineer. The project won the Public Choice first prize at the 2025 National FYP Demo Day.

## Links

- [Team project page — Layth Ayache](https://laythayache.com/projects/omnisign)
- [Team project page — Tayseer Laz](https://tayseerlaz.com/work/omnisign/)

---

*Originally published at [ramikronbi.com](https://ramikronbi.com/writing/building-real-time-lebanese-sign-language-translation). The project: [OmniSign](https://ramikronbi.com/projects/omnisign-lebanese-sign-language).*
