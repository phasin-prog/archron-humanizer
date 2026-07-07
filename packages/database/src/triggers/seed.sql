-- Seed: 12 core disciplines
INSERT INTO objects (id, object_type, slug, title, status, visibility, language, difficulty, description, domains, tags, version, created_at, updated_at) VALUES
  (gen_random_uuid(), 'discipline', 'analytical-psychology', 'Analytical Psychology', 'published', 'public', 'en', 'advanced', 'The school of psychology founded by Carl Jung, focusing on individuation, archetypes, and the collective unconscious.', ARRAY['psychology', 'philosophy'], ARRAY['jung', 'archetypes', 'unconscious'], 1, now(), now()),
  (gen_random_uuid(), 'discipline', 'psychoanalysis', 'Psychoanalysis', 'published', 'public', 'en', 'advanced', 'The therapeutic theory and method developed by Sigmund Freud that explores unconscious mental processes.', ARRAY['psychology'], ARRAY['freud', 'unconscious', 'therapy'], 1, now(), now()),
  (gen_random_uuid(), 'discipline', 'existentialism', 'Existentialism', 'published', 'public', 'en', 'intermediate', 'A philosophical movement focused on individual freedom, choice, and the search for meaning in existence.', ARRAY['philosophy'], ARRAY['sartre', 'kierkegaard', 'meaning'], 1, now(), now()),
  (gen_random_uuid(), 'discipline', 'phenomenology', 'Phenomenology', 'published', 'public', 'en', 'advanced', 'A philosophical approach studying structures of consciousness as experienced from the first-person point of view.', ARRAY['philosophy'], ARRAY['husserl', 'heidegger', 'consciousness'], 1, now(), now()),
  (gen_random_uuid(), 'discipline', 'cognitive-psychology', 'Cognitive Psychology', 'published', 'public', 'en', 'intermediate', 'The scientific study of mental processes including attention, memory, perception, and problem-solving.', ARRAY['psychology'], ARRAY['cognition', 'memory', 'perception'], 1, now(), now()),
  (gen_random_uuid(), 'discipline', 'behavioral-psychology', 'Behavioral Psychology', 'published', 'public', 'en', 'beginner', 'The approach emphasizing observable behavior and the role of environmental factors in shaping actions.', ARRAY['psychology'], ARRAY['skinner', 'pavlov', 'conditioning'], 1, now(), now()),
  (gen_random_uuid(), 'discipline', 'neuroscience', 'Neuroscience', 'published', 'public', 'en', 'advanced', 'The scientific study of the nervous system, brain function, and neural basis of behavior and cognition.', ARRAY['science', 'psychology'], ARRAY['brain', 'neurons', 'cognition'], 1, now(), now()),
  (gen_random_uuid(), 'discipline', 'social-psychology', 'Social Psychology', 'published', 'public', 'en', 'intermediate', 'The study of how individual thoughts, feelings, and behaviors are influenced by social interactions and group dynamics.', ARRAY['psychology', 'sociology'], ARRAY['group', 'conformity', 'identity'], 1, now(), now()),
  (gen_random_uuid(), 'discipline', 'developmental-psychology', 'Developmental Psychology', 'published', 'public', 'en', 'beginner', 'The examination of human growth and change across the lifespan from infancy to old age.', ARRAY['psychology'], ARRAY['piaget', 'childhood', 'lifespan'], 1, now(), now()),
  (gen_random_uuid(), 'discipline', 'postmodernism', 'Postmodernism', 'published', 'public', 'en', 'advanced', 'A critical philosophical and cultural movement questioning grand narratives, truth, and objectivity.', ARRAY['philosophy', 'cultural-studies'], ARRAY['derrida', 'foucault', 'deconstruction'], 1, now(), now()),
  (gen_random_uuid(), 'discipline', 'eastern-philosophy', 'Eastern Philosophy', 'published', 'public', 'en', 'intermediate', 'Philosophical traditions originating from East Asia including Buddhism, Taoism, and Confucianism.', ARRAY['philosophy', 'religion'], ARRAY['buddhism', 'taoism', 'zen'], 1, now(), now()),
  (gen_random_uuid(), 'discipline', 'mythology-studies', 'Mythology Studies', 'published', 'public', 'en', 'intermediate', 'The comparative study of myths, symbolic narratives, and their role in human culture and psychology.', ARRAY['anthropology', 'psychology'], ARRAY['campbell', 'hero', 'symbols'], 1, now(), now());

-- Insert corresponding discipline records by matching slugs
INSERT INTO disciplines (id, object_id, scope, subfields, depth, created_at, updated_at)
SELECT
  gen_random_uuid(),
  o.id,
  CASE o.slug
    WHEN 'analytical-psychology' THEN 'Study of the deep unconscious, archetypes, and the process of individuation as developed by Carl Jung.' 
    WHEN 'psychoanalysis' THEN 'Exploration of unconscious drives, defense mechanisms, and the therapeutic process founded by Sigmund Freud.' 
    WHEN 'existentialism' THEN 'Examination of human freedom, authenticity, anxiety, and the creation of meaning in an absurd world.' 
    WHEN 'phenomenology' THEN 'Investigation of lived experience and the structures of consciousness as phenomena present themselves.' 
    WHEN 'cognitive-psychology' THEN 'Scientific study of mental processes: perception, attention, memory, language, and reasoning.' 
    WHEN 'behavioral-psychology' THEN 'Analysis of observable behavior through principles of conditioning, reinforcement, and environmental control.' 
    WHEN 'neuroscience' THEN 'Understanding the neural substrates of mind — synapses, networks, and brain plasticity.' 
    WHEN 'social-psychology' THEN 'How social contexts, groups, and cultural norms shape individual cognition and behavior.' 
    WHEN 'developmental-psychology' THEN 'How humans develop cognitively, emotionally, and socially from birth through adulthood.' 
    WHEN 'postmodernism' THEN 'Critical deconstruction of metanarratives, power structures, language, and the self.' 
    WHEN 'eastern-philosophy' THEN 'Contemplative traditions of nonduality, emptiness, dependent origination, and harmony with nature.' 
    WHEN 'mythology-studies' THEN 'Comparative analysis of archetypal narratives, hero patterns, and symbolic systems across world cultures.' 
  END,
  CASE o.slug
    WHEN 'analytical-psychology' THEN ARRAY['archetypal theory', 'dream analysis', 'active imagination', 'typology']
    WHEN 'psychoanalysis' THEN ARRAY['dream interpretation', 'transference', 'ego psychology', 'object relations']
    WHEN 'existentialism' THEN ARRAY['authenticity', 'bad faith', 'absurdism', 'anguish']
    WHEN 'phenomenology' THEN ARRAY['intentionality', 'lifeworld', 'bracketing', 'embodiment']
    WHEN 'cognitive-psychology' THEN ARRAY['memory', 'attention', 'perception', 'problem-solving']
    WHEN 'behavioral-psychology' THEN ARRAY['classical conditioning', 'operant conditioning', 'reinforcement', 'modification']
    WHEN 'neuroscience' THEN ARRAY['neuroanatomy', 'neuroplasticity', 'neurochemistry', 'brain imaging']
    WHEN 'social-psychology' THEN ARRAY['social cognition', 'attribution', 'group dynamics', 'persuasion']
    WHEN 'developmental-psychology' THEN ARRAY['cognitive development', 'attachment', 'moral reasoning', 'aging']
    WHEN 'postmodernism' THEN ARRAY['deconstruction', 'discourse analysis', 'power/knowledge', 'simulacra']
    WHEN 'eastern-philosophy' THEN ARRAY['zen buddhism', 'taoism', 'vedanta', 'confucianism']
    WHEN 'mythology-studies' THEN ARRAY['comparative mythology', 'hero journey', 'creation myths', 'symbolism']
  END,
  0,
  now(),
  now()
FROM objects o
LEFT JOIN disciplines d ON d.object_id = o.id
WHERE o.object_type = 'discipline' AND d.id IS NULL;
