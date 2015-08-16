package com.kebe7jun.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.SimpleAdapter;
import android.widget.TextView;

import com.kebe7jun.crazyrobot.R;
import com.kebe7jun.objects.ChatContent;

import java.util.List;

/**
 * Created by kebe0 on 8/16/2015.
 */
public class ChatContentListAdapter extends BaseAdapter {
    List<ChatContent> dataList;
    Context context;
    public ChatContentListAdapter(List<ChatContent> dataList, Context context){
        this.dataList = dataList;
        this.context = context;
    }
    @Override
    public int getCount() {
        return dataList.size();
    }

    @Override
    public Object getItem(int position) {
        return dataList.get(position);
    }

    @Override
    public long getItemId(int position) {
        return 0;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ContentItem item;
//        View leftChatView = LayoutInflater.from(context).inflate(R.layout.chat_left_bubble, parent, false);
//        View righftChatView = LayoutInflater.from(context).inflate(R.layout.chat_right_bubble, parent, false);
        if(convertView == null){
            if(dataList.get(position).getType() == ChatContent.RECEVIED_MSG)
                convertView = LayoutInflater.from(context).inflate(R.layout.chat_left_bubble, parent, false);
            else{
                convertView = LayoutInflater.from(context).inflate(R.layout.chat_right_bubble, parent, false);
            }
            item = new ContentItem(convertView);
            convertView.setTag(item);
        }
        else{
            item = (ContentItem)convertView.getTag();
        }
        item.content.setText(dataList.get(position).getContent());
        return convertView;
    }
    private class ContentItem{
        public TextView content;
        public ContentItem(View view){
            content = (TextView)view.findViewById(R.id.chatContent);
        }
    }
}
