const axios = require('axios');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

class Base {
  constructor() {
    // tools
    this._ = _;

    // plugins
    this.axios = axios;

    // params
    this.serverBaseURL = '';
    this.pathURL = '';
    this.timeOut = 2000;

    const user = JSON.parse(
      fs.readFileSync(path.join(__dirname, './../task/userStatus.json'), {
        encoding: 'utf-8',
      })
    );

    // user data
    const bilibiliJct = user.jct;
    const sessData = user.sessData;
    const userId = user.userId;

    this.userId = userId;
    this.jct = bilibiliJct;
    this.userAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15';
    this.cookie = `bili_jct=${bilibiliJct};SESSDATA=${sessData};DedeUserID=${userId}`;
  }

  async get(url, params = {}, field = '') {
    const headers = {
      'Content-Type': 'application/json',
      Referer: 'https://www.bilibili.com',
      Connection: 'keep-alive',
      'User-Agent': this.userAgent,
      Cookie: this.cookie,
    };

    const result = await axios.get(url, {
      headers,
      params,
    });

    return field === '' ? result.data : this._.get(result.data, field);
  }

  async post(url, params = {}, field = '') {
    const headers = {
      'Content-Type':
        typeof params === 'string'
          ? 'application/x-www-form-urlencoded'
          : 'application/json',
      Referer: 'https://www.bilibili.com',
      Connection: 'keep-alive',
      'User-Agent': this.userAgent,
      Cookie: this.cookie,
    };
    let result = {};

    try {
      result = await axios({
        url,
        method: 'POST',
        headers,
        data: params,
      });
    } catch (e) {
      return null;
    }

    return field === '' ? result.data : this._.get(result.data, field);
  }
}

module.exports = Base;
