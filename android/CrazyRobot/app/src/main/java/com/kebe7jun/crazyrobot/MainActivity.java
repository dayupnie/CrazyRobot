package com.kebe7jun.crazyrobot;

import android.app.Activity;
import android.os.Bundle;
import android.widget.ListView;

import com.kebe7jun.adapter.ChatContentListAdapter;
import com.kebe7jun.objects.ChatContent;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by kebe0 on 8/15/2015.
 */
public class MainActivity extends Activity {
    private ListView chatContentListView = null;
    @Override
    protected void onCreate(Bundle b){
        super.onCreate(b);
        setContentView(R.layout.activity_main);
        initView();
    }
    private void initView(){
        chatContentListView = (ListView)findViewById(R.id.chatContentList);
        List<ChatContent> list = new ArrayList<>();
        for(int i = 0; i<10; i++){
            ChatContent c = new ChatContent("Test_"+i, i%2);
            list.add(c);
        }
        chatContentListView.setAdapter(new ChatContentListAdapter(list, this));
    }
}
