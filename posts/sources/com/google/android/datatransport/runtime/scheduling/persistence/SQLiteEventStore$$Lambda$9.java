package com.google.android.datatransport.runtime.scheduling.persistence;

import android.database.sqlite.SQLiteDatabase;
import com.google.android.datatransport.runtime.TransportContext;
import com.google.android.datatransport.runtime.scheduling.persistence.SQLiteEventStore;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public final /* synthetic */ class SQLiteEventStore$$Lambda$9 implements SQLiteEventStore.Function {
    private final SQLiteEventStore arg$1;
    private final TransportContext arg$2;

    private SQLiteEventStore$$Lambda$9(SQLiteEventStore sQLiteEventStore, TransportContext transportContext) {
        this.arg$1 = sQLiteEventStore;
        this.arg$2 = transportContext;
    }

    public static SQLiteEventStore.Function lambdaFactory$(SQLiteEventStore sQLiteEventStore, TransportContext transportContext) {
        return new SQLiteEventStore$$Lambda$9(sQLiteEventStore, transportContext);
    }

    @Override // com.google.android.datatransport.runtime.scheduling.persistence.SQLiteEventStore.Function
    public Object apply(Object obj) {
        return SQLiteEventStore.lambda$hasPendingEventsFor$5(this.arg$1, this.arg$2, (SQLiteDatabase) obj);
    }
}
