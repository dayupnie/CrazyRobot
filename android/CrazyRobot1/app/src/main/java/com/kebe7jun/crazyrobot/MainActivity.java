package com.kebe7jun.crazyrobot;

import android.app.Activity;
import android.os.Bundle;
import android.os.Message;
import android.view.KeyEvent;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;

import com.kebe7jun.adapter.ChatContentListAdapter;
import com.kebe7jun.handler.ChatSendHandler;
import com.kebe7jun.internet.InternetOperator;
import com.kebe7jun.objects.ChatContent;

import org.json.JSONException;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Handler;

/**
 * Created by kebe0 on 8/15/2015.
 */
public class MainActivity extends Activity {
    private ListView chatContentListView = null;
    private EditText editTextContent = null;
    private Button btnSendMessage = null;
    private ChatSendHandler handler = null;
    private ChatContentListAdapter chatContentListAdapter;

    List<ChatContent> list = new ArrayList<>();
    @Override
    protected void onCreate(Bundle b){
        super.onCreate(b);
        setContentView(R.layout.activity_main);
        initView();
    }
    private void initView(){
        chatContentListView = (ListView)findViewById(R.id.chatContentList);
        editTextContent = (EditText)findViewById(R.id.editTextContent);
        btnSendMessage = (Button)findViewById(R.id.btnSendMessage);
        handler = new ChatSendHandler(this);
        chatContentListAdapter = new ChatContentListAdapter(list, this);
        editTextContent.setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if(keyCode == KeyEvent.KEYCODE_ENTER){
                    doSendMessage();
                    return true;
                }
                return false;
            }
        });
        btnSendMessage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                doSendMessage();
            }
        });
        refresh();
    }
    private void doSendMessage(){
        final String content = editTextContent.getText().toString();
        if(content.compareTo("") == 0)
            return;
        editTextContent.setText("");
        ChatContent chatContent = new ChatContent(content, ChatContent.SENT_MSG);
        addMessage(chatContent);
        new Thread(){
            @Override
            public void run() {
                try {
                    String result = InternetOperator.postDataToInternet(content,
                            "http://crazyforcode.org:8888/chat.cfc");
                    Bundle b = new Bundle();
                    b.putString("result", result);
                    Message msg = new Message();
                    msg.setData(b);
                    handler.sendMessage(msg);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }.start();
    }
    public void addMessage(ChatContent chatContent){
        list.add(chatContent);
        refresh();
    }
    private void refresh(){
        chatContentListView.setAdapter(chatContentListAdapter);
        chatContentListView.setSelection(list.size());
    }
}
