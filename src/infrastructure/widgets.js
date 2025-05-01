import React, { Component } from 'react';

import TimeAgo from 'react-timeago';
import chineseStrings from 'react-timeago/lib/language-strings/zh-CN';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import copy from 'copy-to-clipboard';

import './global.css';
import './widgets.css';
import emailExample from '../images/email_example.jpg';

import { EMAIL } from '../UserAction';

function pad2(x) {
  return x < 10 ? '0' + x : '' + x;
}
export function format_time(time) {
  return `${time.getMonth() + 1}-${pad2(
    time.getDate(),
  )} ${time.getHours()}:${pad2(time.getMinutes())}:${pad2(time.getSeconds())}`;
}
const chinese_format = buildFormatter(chineseStrings);
export function Time(props) {
  const time = new Date(props.stamp * 1000);
  return (
    <span className={'time-str'}>
      <TimeAgo
        date={time}
        formatter={chinese_format}
        title={time.toLocaleString('zh-CN', {
          timeZone: 'Asia/Shanghai',
          hour12: false,
        })}
      />
      &nbsp;
      {!props.short ? format_time(time) : null}
    </span>
  );
}

export function TitleLine(props) {
  return (
    <p className="centered-line title-line aux-margin">
      <span className="black-outline">{props.text}</span>
    </p>
  );
}

export function GlobalTitle(props) {
  return (
    <div className="aux-margin">
      <div className="title">
        <p className="centered-line">{props.text}</p>
      </div>
    </div>
  );
}

async function sha256_hex(text, l = null) {
  let hash_buffer = await window.crypto.subtle.digest('SHA-256' , new TextEncoder().encode(text));
  let hex_str = Array.from(new Uint8Array(hash_buffer)).map((b) => b.toString(16).padStart(2, '0')).join('');
  return l ? hex_str.slice(0, l) : hex_str
}

class LoginPopupSelf extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token_phrase: '',
      already_copy: false,
    };
  }

  setThuhole(e) {
    e.preventDefault();
    alert('T大树洞已经没有啦😭');
  }

  copy_token_hash() {
    const { token_phrase } = this.state;
    if (!token_phrase) {
      alert('不可以为空');
      return;
    }

    sha256_hex(token_phrase + 'hole' + new Date().toDateString(), 16)
      .then((token) => sha256_hex(token + 'hole', 16))
      .then((token_hash) => copy(`|${token_hash}|\n\n随便写点内容以免被当成垃圾邮件`));

    this.setState({already_copy: true});
  }

  copy_token_phrase() {
    const { token_phrase } = this.state;
    if (!token_phrase) {
      alert('不可以为空');
      return;
    }
    copy(token_phrase);
  }

  use_token() {
    const { token_phrase } = this.state;
    if (!token_phrase) {
      alert('不可以为空');
      return;
    }

    sha256_hex(token_phrase + 'hole' + new Date().toDateString(), 16)
      .then((token) => {
        localStorage['TOKEN'] = 'sha256:' + token;
        window.location.reload();
      });
  }

  render() {
    const { token_phrase, already_copy } = this.state;
    return (
      <div>
        <div className="thuhole-login-popup-shadow" />
        <div className="thuhole-login-popup">
          {/* <h3>直接邮箱登录</h3>
          <small>(请使用清华邮箱/校友邮箱发件)</small>
          <p>
            <input value={token_phrase} onChange={(event) => this.setState({token_phrase: event.target.value})} />
          </p>
          <div className="thuhole-login-popup-info">
            <ol>
              <li>
                <a href="###" onClick={() => this.setState({token_phrase: window.crypto.randomUUID(), already_copy: false})}>
                  生成
                </a>
                或粘贴用来生成token的ID。
              </li>
              {!!token_phrase && (
                <>
                  <li>
                    <a href="###" onClick={this.copy_token_phrase.bind(this)}><b>点击此处</b></a>
                    复制此ID用于在其他设备上登录，当日有效，注意妥善保管。
                  </li>
                  <li>
                    <a href="###" onClick={this.copy_token_hash.bind(this)}><b>点击此处</b></a>
                    复制用来发送邮件的内容
                  </li>
                </>
              )}
              {!!already_copy ? (
                <>
                  <li>
                    发送邮件到
                    <a href={'mailto:' + EMAIL}>{EMAIL}</a>。
                    不同设备请勿重复发件。
                    示例:
                    <img src={emailExample} className="li-image"/>
                  </li>
                  <li>
                    后台每15分钟查收一次邮件，等待一段时间后
                    <a href="###" onClick={this.use_token.bind(this)}><b>点击此处</b></a>
                    使用此token登录。
                  </li>
                </>
              ) : (
                <li>...</li>
              )}
            </ol> */}
          {/* </div> */}
          <br />
          <h3>第三方认证登录</h3>
          <p>
            <a href={window.BACKEND + "_login/gh"} target="_blank"
              referrerPolicy="origin"
            >
              <span className="icon icon-login" />
              &nbsp;GitHub
            </a>
            <br></br>
            <a href={window.BACKEND + "_login/gh_cn"} target="_blank"
              referrerPolicy="origin"
            >
              <span className="icon icon-login" />
              &nbsp;GitHub(CN)
            </a>
            <br/ >
            <small>(请先添加北大邮箱/清华邮箱/校友邮箱)</small>
          </p>
          {/* <p>
            <a href={window.BACKEND + "_login?p=cs"} target="_blank"
              referrerPolicy="origin"
            >
              <span className="icon icon-login" />
              &nbsp;闭社
            </a>
          </p>
          <p>
            <a
              href={window.BACKEND + "_login?p=thuhole"}
              target="_blank"
              onClick={this.setThuhole}
            >
              <span className="icon icon-login" />
              &nbsp;T大树洞
            </a>
          </p>
          <p>
            <small>前往Telegram群查询15分钟临时token</small>
            <br />
            <a href="//t.me/THUChatBot" target="_blank">
              <span className="icon icon-login" />
              &nbsp;清华大水群
            </a>
          </p>
          <p>
            <button type="button" disabled>
              <span className="icon icon-login" />
              &nbsp;清华统一身份认证
            </button>
          </p> */}
          <hr />
          <p>
            <button onClick={this.props.on_close}>取消</button>
          </p>
          <hr />
          <div className="thuhole-login-popup-info">
            <p>提醒:</p>
            <ul>
              <li>新T树洞的匿名性既来自隔离用户名与发布的内容，也来自隔离用户名与真实身份。</li>
              <li> 目前一个人可能有多个帐号。</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export class LoginPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popup_show: false,
    };
    this.on_popup_bound = this.on_popup.bind(this);
    this.on_close_bound = this.on_close.bind(this);
  }

  on_popup() {
    this.setState({
      popup_show: true,
    });
  }
  on_close() {
    this.setState({
      popup_show: false,
    });
  }

  render() {
    return (
      <>
        {this.props.children(this.on_popup_bound)}
        {this.state.popup_show && (
          <LoginPopupSelf
            token_callback={this.props.token_callback}
            on_close={this.on_close_bound}
          />
        )}
      </>
    );
  }
}
