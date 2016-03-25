package com.kebe7jun.crazyrobot;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

/**
 * Created by KEBE on 8/22/2015.
 */
public class MainActivity extends Activity {
    @Override
    protected void onCreate(Bundle bundle){
        super.onCreate(bundle);
        setContentView(R.layout.activity_main);
        Intent chatActivity = new Intent();
        chatActivity.setClass(this, ChatActivity.class);
        startActivity(chatActivity);
        finish();
    }
}
