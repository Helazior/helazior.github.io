package com.google.android.datatransport;

import java.util.Objects;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public final class AutoValue_Event<T> extends Event<T> {
    private final Integer code;
    private final T payload;
    private final Priority priority;

    public AutoValue_Event(Integer num, T t, Priority priority) {
        this.code = num;
        Objects.requireNonNull(t, "Null payload");
        this.payload = t;
        Objects.requireNonNull(priority, "Null priority");
        this.priority = priority;
    }

    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (obj instanceof Event) {
            Event event = (Event) obj;
            Integer num = this.code;
            if (num != null ? num.equals(event.getCode()) : event.getCode() == null) {
                if (this.payload.equals(event.getPayload()) && this.priority.equals(event.getPriority())) {
                    return true;
                }
            }
            return false;
        }
        return false;
    }

    @Override // com.google.android.datatransport.Event
    public Integer getCode() {
        return this.code;
    }

    @Override // com.google.android.datatransport.Event
    public T getPayload() {
        return this.payload;
    }

    @Override // com.google.android.datatransport.Event
    public Priority getPriority() {
        return this.priority;
    }

    public int hashCode() {
        Integer num = this.code;
        return (((((num == null ? 0 : num.hashCode()) ^ 1000003) * 1000003) ^ this.payload.hashCode()) * 1000003) ^ this.priority.hashCode();
    }

    public String toString() {
        StringBuilder m253r = outline.m253r("Event{code=");
        m253r.append(this.code);
        m253r.append(", payload=");
        m253r.append(this.payload);
        m253r.append(", priority=");
        m253r.append(this.priority);
        m253r.append("}");
        return m253r.toString();
    }
}
