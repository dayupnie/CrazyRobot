package com.kebe7jun.internet;


import android.os.Bundle;
import android.os.Handler;
import android.os.Message;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;

/**
 * Created by KEBE on 8/22/2015.
 */
public abstract class PostDataInterface {
    /**
     * Url
     */
    private String url;
    /**
     * 相当于<input>的name
     */
    private String name = "question";
    /**
     * 相当于<input>的value
     */
    private String value;
    /**
     * 超时描述
     */
    private int timeOutSecond = 10;
    /**
     * Handler
     */
    private InnerHandler handler;
    public PostDataInterface(String postData, String url){
        this.url= url;
        this.value = postData;
        onStart();
    }
    public PostDataInterface(String postData, String url, int timeOutSecond){
        this(postData, url);
        setTimeOutSecond(timeOutSecond);
    }
    public PostDataInterface(String name, String postData, String url){
        this(postData, url);
        setName(name);
    }
    public PostDataInterface(String name, String postData, String url, int timeOutSecond){
        this(name,postData,url);
        setTimeOutSecond(timeOutSecond);
    }
    private void onStart(){
        handler = new InnerHandler();
        Thread netThread = new Thread(){
            @Override
            public void run(){
                String resule = postDataToInternet();
                Message msg = new Message();
                Bundle b = new Bundle();
                b.putString("result", resule);
                msg.setData(b);
                handler.sendMessage(msg);
            }
        };
        netThread.start();
    }
    /**
     * 设置name参数
     * @param name
     */
    public void setName(String name){
        this.name = name;
    }

    /**
     * 设置超时
     * @param timeOutSecond
     */
    public void setTimeOutSecond(int timeOutSecond){
        this.timeOutSecond = timeOutSecond;
    }

    /**
     * 提交数据给服务器。
     * @return
     */
    private String postDataToInternet() {
        try {
// 建立连接
            URL url = new URL(this.url);
            HttpURLConnection httpConn = (HttpURLConnection) url.openConnection();

            httpConn.setDoOutput(true);// 使用 URL 连接进行输出
            httpConn.setDoInput(true);// 使用 URL 连接进行输入
            httpConn.setUseCaches(false);// 忽略缓存
            httpConn.setRequestMethod("POST");// 设置URL请求方法
            httpConn.setConnectTimeout(this.timeOutSecond*1000);

            value = this.name+"="+value;
            byte[] requestStringBytes = value.getBytes("UTF-8");
            httpConn.setRequestProperty("Content-length", "" + requestStringBytes.length);
            httpConn.setRequestProperty("Content-Type", "application/octet-stream");
            httpConn.setRequestProperty("Connection", "Keep-Alive");// 维持长连接
            httpConn.setRequestProperty("Charset", "UTF-8");

            OutputStream outputStream = httpConn.getOutputStream();
            outputStream.write(requestStringBytes);
            outputStream.close();

            int responseCode = httpConn.getResponseCode();

            if (HttpURLConnection.HTTP_OK == responseCode) {// 连接成功
                StringBuffer sb = new StringBuffer();
                String readLine;
                BufferedReader responseReader;
                responseReader = new BufferedReader(new InputStreamReader(httpConn.getInputStream(), "UTF-8"));
                while ((readLine = responseReader.readLine()) != null) {
                    sb.append(readLine).append("\n");
                }
                responseReader.close();
                return sb.toString();
            }
            else {
                return "{\"result\":1003}";
            }
    } catch (MalformedURLException e) {
            return e.toString();
        } catch (UnsupportedEncodingException e) {
            return e.toString();
        } catch (ProtocolException e) {
            return e.toString();
        } catch (IOException e) {
            return e.toString();
        }
    }

    /**
     * 从服务器成功获取数据
     * @param result
     */
    public abstract void onSuccess(String result);
    private class InnerHandler extends Handler {
        @Override
        public void handleMessage(Message msg){
            Bundle b = msg.getData();
            String result = b.getString("result");
            onSuccess(result);
        }
    }
}