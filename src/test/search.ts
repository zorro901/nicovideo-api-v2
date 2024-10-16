import { createClient } from '../index';

const nicovideo = createClient();
try {
  const result = await nicovideo.searchVideos({
    q: '初音ミク',
    targets: {
      title: true,
    },
    limit: 3,
    context: 'apiguide',
    sort: { lengthSeconds: 'desc' },
    fields: {
      title: true,
      lengthSeconds: true,
      mylistCounter:true
    },
    jsonFilter: {
      type: 'and',
      filters: [
        {
          type: 'equal',
          field: 'tags',
          value:'ボカコレ2021秋MMD_3DCG'
        },
        {
          type: 'equal',
          field: 'tags',
          value:'REM式初音ミク'
        },
      ],
    },
    // jsonFilter: {
    //   type: 'or',
    //   filters: [
    //     {
    //       'type': 'range',
    //       'field': 'startTime',
    //       'from': '2017-07-07T00:00:00+09:00',
    //       'to': '2017-07-08T00:00:00+09:00',
    //       'include_lower': true,
    //     },
    //     {
    //       'type': 'range',
    //       'field': 'startTime',
    //       'from': '2016-07-07T00:00:00+09:00',
    //       'to': '2016-07-08T00:00:00+09:00',
    //       'include_lower': true,
    //     },
    //   ],
    // },
    filters: {
      // viewCounter: {
      //   min: 100,  // gte の代わりに min
      //   max: 1000   // lte の代わりに max
      // },
      // tagsExact:"ゲーム",
      // genreKeyword:"ゲーム",
      // 'genre.keyword':"ゲーム",
      // 'genre':"ゲーム",
      // tags:'ボカコレ2021秋MMD_3DCG',
      // tags:'REM式初音ミク',
      mylistCounter: {
        min: 113,
        max: 113
      },
      startTime: {
        from: '2021', // 2022年のデータのみを抽出する
        to: '2023'
      }
    },
  });
  console.log(result);
} catch (error) {
  console.error('Error fetching data from NicoVideo API:', error);
}