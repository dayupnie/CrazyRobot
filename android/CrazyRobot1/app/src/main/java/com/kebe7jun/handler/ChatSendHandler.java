package com.kebe7jun.handler;


import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Xml;

import com.kebe7jun.crazyrobot.MainActivity;
import com.kebe7jun.objects.ChatContent;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;

/**
 * Created by kebe0 on 8/16/2015.
 */
public class ChatSendHandler extends Handler {
    MainActivity activity;
    public ChatSendHandler(MainActivity activity){
        this.activity = activity;
    }
    @Override
    public void handleMessage(Message msg) {
        super.handleMessage(msg);
        Bundle b = msg.getData();
        String result;
        if((result = b.getString("result"))!=null){
            ChatContent chatContent = null;
            try {
                JSONObject jsonObject = new JSONObject(result);
                chatContent = new ChatContent(new String(jsonObject.getString("data").getBytes("ISO-8859-1"), "UTF-8"), ChatContent.RECEVIED_MSG);
            } catch (JSONException e) {
                chatContent = new ChatContent("奥，我暂时回答不了你这个问题，请用“问题～～答案”的形式告诉奴婢好吗～", ChatContent.RECEVIED_MSG);
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            activity.addMessage(chatContent);
        }
    }
}
