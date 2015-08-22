package com.kebe7jun.objects;

/**
 * Created by kebe0 on 8/16/2015.
 */
public class ChatContent {
    public static final int RECEVIED_MSG = 0x00;
    public static final int SENT_MSG = 0x01;

    private String content;
    private int type;
    public ChatContent(String content, int type){
        this.content =content;
        this.type = type;
    }
    public String getContent(){
        return content;
    }
    public int getType(){
        return type;
    }
}
