-- OKOP'S PRODUCTION-READY MASTER SCHEMA
-- Optimized for Supabase with Race-Condition Prevention and Hardened Security

-- ==========================================
-- 1. EXTENSIONS & UTILITIES
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 2. CORE TABLES (ORDERED BY DEPENDENCY)
-- ==========================================

-- PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    username CITEXT UNIQUE,
    avatar_url TEXT,
    cover_url TEXT,
    bio TEXT,
    college TEXT DEFAULT 'Stanford University',
    department TEXT,
    semester INTEGER,
    graduation_year INTEGER,
    interests TEXT[] DEFAULT '{}',
    skills TEXT[] DEFAULT '{}',
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'moderator', 'admin')),
    xp_points INTEGER DEFAULT 0,
    daily_streak INTEGER DEFAULT 0,
    follower_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    post_count INTEGER DEFAULT 0,
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    is_profile_public BOOLEAN DEFAULT TRUE,
    is_ghost_mode BOOLEAN DEFAULT FALSE,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- MESSAGING (Moved before events to resolve FK reference)
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    is_group BOOLEAN DEFAULT FALSE,
    name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conversation_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    last_read_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    content TEXT,
    file_url TEXT,
    is_edited BOOLEAN DEFAULT FALSE,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FRIENDS
CREATE TABLE IF NOT EXISTS friend_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(sender_id, receiver_id)
);

CREATE TABLE IF NOT EXISTS friends (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    friend_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, friend_id)
);

-- COMMUNITIES
CREATE TABLE IF NOT EXISTS communities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug CITEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    banner_url TEXT,
    category TEXT,
    member_count INTEGER DEFAULT 0,
    creator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER update_communities_updated_at BEFORE UPDATE ON communities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS community_members (
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (community_id, user_id)
);

-- EVENTS
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    community_id UUID REFERENCES communities(id) ON DELETE SET NULL,
    conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    location TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    max_participants INTEGER,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS event_registrations (
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    checked_in BOOLEAN DEFAULT FALSE,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY(event_id, user_id)
);

-- MOMENTS (Ephemeral)
CREATE TABLE IF NOT EXISTS moments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    image_url TEXT,
    location_name TEXT,
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ACADEMIC VAULT
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uploader_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subject TEXT,
    department TEXT,
    file_url TEXT NOT NULL,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MEET SPOTS
CREATE TABLE IF NOT EXISTS meet_spots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS meet_spot_checkins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    spot_id UUID REFERENCES meet_spots(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '2 hours'),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SOCIAL
CREATE TABLE IF NOT EXISTS follows (
    follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id)
);

CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT,
    media_urls TEXT[] DEFAULT '{}',
    location_name TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS post_likes (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS post_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS post_bookmarks (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (post_id, user_id)
);

-- MARKETPLACE & PLACEMENTS
CREATE TABLE IF NOT EXISTS placement_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL,
    role TEXT NOT NULL,
    description TEXT,
    location TEXT,
    package_info TEXT,
    deadline TIMESTAMPTZ,
    apply_url TEXT,
    category TEXT CHECK (category IN ('internship', 'full-time')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketplace_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    price DOUBLE PRECISION,
    category TEXT,
    location TEXT,
    image_url TEXT,
    seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    is_sold BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lost_found (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('lost', 'found')),
    location TEXT,
    image_url TEXT,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS & TOKENS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    type TEXT,
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_device_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    device_type TEXT,
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, token)
);

-- SYSTEM LOGS & RATE LIMITS
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rate_limits (
    key TEXT PRIMARY KEY,
    request_count INTEGER DEFAULT 1,
    last_request TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. AUTOMATION & ATOMIC STORED PROCEDURES
-- ==========================================

-- Auto-Profile Handler
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New Student'),
    'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.id,
    'student_' || substring(NEW.id::text, 1, 8)
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Atomic Friend Request Accept Procedure
CREATE OR REPLACE FUNCTION accept_friend_request(req_id UUID)
RETURNS VOID AS $$
DECLARE
    v_sender_id UUID;
    v_receiver_id UUID;
BEGIN
    SELECT sender_id, receiver_id INTO v_sender_id, v_receiver_id
    FROM friend_requests
    WHERE id = req_id AND receiver_id = auth.uid() AND status = 'pending';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Friend request not found or unauthorized.';
    END IF;

    -- Update Request Status
    UPDATE friend_requests SET status = 'accepted' WHERE id = req_id;

    -- Insert Symmetric Friendship
    INSERT INTO friends (user_id, friend_id) VALUES (v_sender_id, v_receiver_id) ON CONFLICT DO NOTHING;
    INSERT INTO friends (user_id, friend_id) VALUES (v_receiver_id, v_sender_id) ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Atomic Direct Message Creator
-- Atomic Direct Message Creator
CREATE OR REPLACE FUNCTION create_dm_conversation(user1_id UUID, user2_id UUID)
RETURNS UUID AS $$
DECLARE
    new_conv_id UUID;
BEGIN
    -- Check for existing DM
    SELECT cp1.conversation_id INTO new_conv_id
    FROM conversation_participants cp1
    JOIN conversation_participants cp2 ON cp1.conversation_id = cp2.conversation_id
    JOIN conversations c ON c.id = cp1.conversation_id
    WHERE cp1.user_id = user1_id
      AND cp2.user_id = user2_id
      AND c.is_group = FALSE
    LIMIT 1;

    IF new_conv_id IS NOT NULL THEN
        RETURN new_conv_id;
    END IF;

    -- Create new conversation
    INSERT INTO conversations (is_group) VALUES (FALSE) RETURNING id INTO new_conv_id;

    -- Add participants
    INSERT INTO conversation_participants (conversation_id, user_id)
    VALUES (new_conv_id, user1_id), (new_conv_id, user2_id);

    RETURN new_conv_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Social Graph Count Automation
CREATE OR REPLACE FUNCTION update_social_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        IF (TG_TABLE_NAME = 'follows') THEN
            UPDATE profiles SET follower_count = follower_count + 1 WHERE id = NEW.following_id;
            UPDATE profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
        ELSIF (TG_TABLE_NAME = 'posts') THEN
            UPDATE profiles SET post_count = post_count + 1 WHERE id = NEW.author_id;
        ELSIF (TG_TABLE_NAME = 'community_members') THEN
            UPDATE communities SET member_count = member_count + 1 WHERE id = NEW.community_id;
        END IF;
    ELSIF (TG_OP = 'DELETE') THEN
        IF (TG_TABLE_NAME = 'follows') THEN
            UPDATE profiles SET follower_count = GREATEST(0, follower_count - 1) WHERE id = OLD.following_id;
            UPDATE profiles SET following_count = GREATEST(0, following_count - 1) WHERE id = OLD.follower_id;
        ELSIF (TG_TABLE_NAME = 'posts') THEN
            UPDATE profiles SET post_count = GREATEST(0, post_count - 1) WHERE id = OLD.author_id;
        ELSIF (TG_TABLE_NAME = 'community_members') THEN
            UPDATE communities SET member_count = GREATEST(0, member_count - 1) WHERE id = OLD.community_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_follow_change ON follows;
CREATE TRIGGER on_follow_change AFTER INSERT OR DELETE ON follows FOR EACH ROW EXECUTE FUNCTION update_social_counts();

DROP TRIGGER IF EXISTS on_post_change ON posts;
CREATE TRIGGER on_post_change AFTER INSERT OR DELETE ON posts FOR EACH ROW EXECUTE FUNCTION update_social_counts();

DROP TRIGGER IF EXISTS on_community_member_change ON community_members;
CREATE TRIGGER on_community_member_change AFTER INSERT OR DELETE ON community_members FOR EACH ROW EXECUTE FUNCTION update_social_counts();

-- ==========================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View own friend requests" ON friend_requests FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Send friend requests" ON friend_requests FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Update received friend requests" ON friend_requests FOR UPDATE USING (auth.uid() = receiver_id);

ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Friends viewable by everyone" ON friends FOR SELECT USING (true);

ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Communities viewable by everyone" ON communities FOR SELECT USING (true);
CREATE POLICY "Authenticated users create communities" ON communities FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Creators update communities" ON communities FOR UPDATE USING (auth.uid() = creator_id);

ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members viewable by everyone" ON community_members FOR SELECT USING (true);
CREATE POLICY "Users join communities" ON community_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users leave communities" ON community_members FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Events viewable by everyone" ON events FOR SELECT USING (true);
CREATE POLICY "Users create events" ON events FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators update events" ON events FOR UPDATE USING (auth.uid() = creator_id);

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Registrations viewable by everyone" ON event_registrations FOR SELECT USING (true);
CREATE POLICY "Users register for events" ON event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users cancel registration" ON event_registrations FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE moments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View unexpired moments" ON moments FOR SELECT USING (expires_at > NOW());
CREATE POLICY "Post moments" ON moments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Delete own moments" ON moments FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "conversations_select" ON conversations FOR SELECT USING (
  id IN (SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid())
);
CREATE POLICY "conversations_insert" ON conversations FOR INSERT WITH CHECK (auth.role() = 'authenticated');

ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "participants_select" ON conversation_participants FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "participants_insert" ON conversation_participants FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "participants_delete" ON conversation_participants FOR DELETE USING (user_id = auth.uid());

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages_select" ON messages FOR SELECT USING (
  conversation_id IN (SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid())
);
CREATE POLICY "messages_insert" ON messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  conversation_id IN (SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid())
);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Follows viewable by everyone" ON follows FOR SELECT USING (true);
CREATE POLICY "Users follow others" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users unfollow others" ON follows FOR DELETE USING (auth.uid() = follower_id);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Posts viewable by everyone" ON posts FOR SELECT USING (true);
CREATE POLICY "Users create posts" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors update posts" ON posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors delete posts" ON posts FOR DELETE USING (auth.uid() = author_id);

ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Likes viewable by everyone" ON post_likes FOR SELECT USING (true);
CREATE POLICY "Users like posts" ON post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users unlike posts" ON post_likes FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments viewable by everyone" ON post_comments FOR SELECT USING (true);
CREATE POLICY "Users comment" ON post_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors delete comments" ON post_comments FOR DELETE USING (auth.uid() = author_id);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_select" ON notifications FOR SELECT USING (auth.uid() = receiver_id);
CREATE POLICY "notifications_insert" ON notifications FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "notifications_update" ON notifications FOR UPDATE USING (auth.uid() = receiver_id);

ALTER TABLE user_device_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View own tokens" ON user_device_tokens FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Insert own tokens" ON user_device_tokens FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Delete own tokens" ON user_device_tokens FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Notes viewable by everyone" ON notes FOR SELECT USING (true);
CREATE POLICY "Users upload notes" ON notes FOR INSERT WITH CHECK (auth.uid() = uploader_id);

ALTER TABLE placement_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Placements viewable by everyone" ON placement_listings FOR SELECT USING (true);

ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Marketplace viewable by everyone" ON marketplace_items FOR SELECT USING (true);
CREATE POLICY "Users post marketplace items" ON marketplace_items FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers update items" ON marketplace_items FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Sellers delete items" ON marketplace_items FOR DELETE USING (auth.uid() = seller_id);

ALTER TABLE lost_found ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lost & Found viewable by everyone" ON lost_found FOR SELECT USING (true);
CREATE POLICY "Users post lost/found" ON lost_found FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners update lost/found" ON lost_found FOR UPDATE USING (auth.uid() = user_id);

ALTER TABLE meet_spots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Meet spots viewable by everyone" ON meet_spots FOR SELECT USING (true);

ALTER TABLE meet_spot_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Checkins viewable by everyone" ON meet_spot_checkins FOR SELECT USING (true);
CREATE POLICY "Users checkin" ON meet_spot_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);

-- SYSTEM LOGS
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
-- Internal table: Service role read/write only.

-- ==========================================
-- 5. PERFORMANCE INDEXES
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_moments_expires_at ON moments(expires_at);
CREATE INDEX IF NOT EXISTS idx_moments_user_id ON moments(user_id);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_receiver_id ON notifications(receiver_id);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);

-- REALTIME ENABLERS
ALTER PUBLICATION supabase_realtime ADD TABLE marketplace_items;
ALTER PUBLICATION supabase_realtime ADD TABLE events;
ALTER PUBLICATION supabase_realtime ADD TABLE event_registrations;
ALTER PUBLICATION supabase_realtime ADD TABLE moments;
ALTER PUBLICATION supabase_realtime ADD TABLE meet_spot_checkins;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE follows;
ALTER PUBLICATION supabase_realtime ADD TABLE posts;
ALTER PUBLICATION supabase_realtime ADD TABLE post_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE post_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE friend_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE friends;