"""
ESCO ICT Skill Taxonomy Engine
Ported from: FINAL AI SKILL ANALYZER.ipynb — Step 3
Provides canonical skill definitions, alias normalization, and prerequisite dependency graph.
"""

import re
from typing import List, Dict, Optional
from dataclasses import dataclass, field


@dataclass
class ESCOSkill:
    preferred_label: str
    alt_labels: List[str]
    category: str
    description: str
    implicit_prerequisites: List[str] = field(default_factory=list)


class ESCOTaxonomyEngine:
    """
    Standardized ESCO Skill Taxonomy engine with alias normalization,
    contextual semantic definitions, and prerequisite dependency graph traversal.
    """

    def __init__(self):
        self.skills: Dict[str, ESCOSkill] = {}
        self.alias_to_canonical: Dict[str, str] = {}
        self._build_ict_taxonomy()

    def _add_skill(self, pref_label: str, alt_labels: List[str], category: str,
                   description: str, prereqs: List[str]):
        canonical = pref_label.strip()
        skill_obj = ESCOSkill(
            preferred_label=canonical,
            alt_labels=[a.strip() for a in alt_labels],
            category=category.strip(),
            description=description.strip(),
            implicit_prerequisites=[p.strip() for p in prereqs]
        )
        self.skills[canonical.lower()] = skill_obj
        self.alias_to_canonical[canonical.lower()] = canonical
        for alt in alt_labels:
            self.alias_to_canonical[alt.strip().lower()] = canonical

    def _build_ict_taxonomy(self):
        """Constructs standardized ESCO ICT technical skills across 7 major clusters."""

        # 1. Programming Languages & Runtimes
        self._add_skill("Python", ["python3", "py", "cpython"], "Programming Languages",
                        "High-level general-purpose programming language emphasizing code readability, widely used in data science, AI, and web backend.",
                        ["Object-Oriented Programming", "Algorithmic Thinking"])
        self._add_skill("JavaScript", ["js", "es6", "ecmascript"], "Programming Languages",
                        "Dynamic scripting language for web client-side development and asynchronous runtime environments.",
                        ["Web Development Basics", "Algorithmic Thinking"])
        self._add_skill("TypeScript", ["ts"], "Programming Languages",
                        "Strictly typed syntactical superset of JavaScript adding static type definitions for large-scale application development.",
                        ["JavaScript", "Object-Oriented Programming"])
        self._add_skill("Java", ["java core", "jdk", "jvm"], "Programming Languages",
                        "Class-based object-oriented language running on the Java Virtual Machine for enterprise-grade applications.",
                        ["Object-Oriented Programming", "Memory Management Basics"])
        self._add_skill("Go", ["golang"], "Programming Languages",
                        "Statically typed, compiled programming language designed at Google for concurrent, scalable networking and cloud systems.",
                        ["Concurrency Patterns", "Systems Programming Basics"])
        self._add_skill("Rust", ["rustlang"], "Programming Languages",
                        "Systems programming language focused on memory safety, concurrency, and zero-cost abstractions without garbage collection.",
                        ["Memory Management Basics", "Systems Programming Basics"])
        self._add_skill("C++", ["cpp", "c plus plus"], "Programming Languages",
                        "High-performance compiled language supporting procedural, object-oriented, and generic programming paradigms.",
                        ["C", "Memory Management Basics", "Object-Oriented Programming"])
        self._add_skill("Bash/Shell", ["bash", "shell scripting", "sh", "zsh"], "Programming Languages",
                        "Command-line shell and scripting language for task automation and operating system interaction in Unix environments.",
                        ["Linux Administration"])

        # 2. Web & Frontend Frameworks
        self._add_skill("React", ["reactjs", "react.js"], "Web & Frontend Frameworks",
                        "Component-based JavaScript library for building declarative, interactive user interfaces with virtual DOM.",
                        ["JavaScript", "HTML5/CSS3", "State Management"])
        self._add_skill("Node.js", ["nodejs", "node"], "Web & Frontend Frameworks",
                        "Asynchronous event-driven JavaScript runtime built on Chrome's V8 engine for scalable network applications.",
                        ["JavaScript", "Asynchronous Programming", "RESTful API Design"])
        self._add_skill("FastAPI", ["fastapi framework"], "Web & Frontend Frameworks",
                        "Modern, high-performance web framework for building APIs with Python based on standard Python type hints.",
                        ["Python", "RESTful API Design", "Asynchronous Programming"])
        self._add_skill("Django", ["django framework"], "Web & Frontend Frameworks",
                        "High-level Python web framework that encourages rapid development and clean, pragmatic architectural design.",
                        ["Python", "Web Development Basics", "Relational Database Design"])
        self._add_skill("HTML5/CSS3", ["html", "css", "html5", "css3", "web styling"], "Web & Frontend Frameworks",
                        "Foundational markup and stylesheet standards structuring and formatting visual presentations on the World Wide Web.",
                        ["Web Development Basics"])
        self._add_skill("Next.js", ["nextjs"], "Web & Frontend Frameworks",
                        "Production React framework enabling server-side rendering, static site generation, and hybrid web applications.",
                        ["React", "JavaScript", "Node.js"])
        self._add_skill("State Management", ["redux", "zustand", "mobx", "state management patterns"], "Web & Frontend Frameworks",
                        "Architectural patterns and libraries for synchronizing application state across complex frontend component trees.",
                        ["JavaScript"])

        # 3. Cloud, Containers & DevOps
        self._add_skill("Kubernetes", ["k8s", "kubernetes cluster", "container orchestration"], "Cloud & DevOps",
                        "Open-source system for automating deployment, scaling, and operational management of containerized applications.",
                        ["Docker", "Linux Administration", "Container Networking", "CI/CD"])
        self._add_skill("Docker", ["docker containers", "containerization"], "Cloud & DevOps",
                        "Platform utilizing OS-level virtualization to deliver software packages in isolated, reproducible lightweight containers.",
                        ["Linux Administration", "Operating System Basics"])
        self._add_skill("AWS", ["amazon web services", "aws cloud"], "Cloud & DevOps",
                        "Comprehensive cloud computing platform offering compute, storage, networking, and managed serverless infrastructure.",
                        ["Cloud Computing Concepts", "Linux Administration", "Networking Fundamentals"])
        self._add_skill("Terraform", ["hashicorp terraform", "iac"], "Cloud & DevOps",
                        "Infrastructure as Code tool for building, changing, and versioning cloud and on-premises infrastructure safely.",
                        ["Cloud Computing Concepts", "DevOps Principles", "Infrastructure as Code"])
        self._add_skill("CI/CD", ["continuous integration", "continuous deployment", "github actions", "gitlab ci", "jenkins"], "Cloud & DevOps",
                        "Automated pipeline practices bridging software development, automated testing, artifact creation, and production release.",
                        ["Git Version Control", "Automated Testing", "DevOps Principles"])
        self._add_skill("Linux Administration", ["linux", "unix", "ubuntu", "rhel", "sysadmin"], "Cloud & DevOps",
                        "Configuring, maintaining, securing, and troubleshooting Unix-like server operating systems and process environments.",
                        ["Operating System Basics"])
        self._add_skill("Prometheus", ["prometheus monitoring"], "Cloud & DevOps",
                        "Systems monitoring and alerting toolkit collecting multi-dimensional time series metrics with PromQL.",
                        ["Linux Administration", "Observability Principles"])
        self._add_skill("Grafana", ["grafana dashboards"], "Cloud & DevOps",
                        "Multi-platform analytics and interactive data visualization web application for telemetry and metric visualization.",
                        ["Observability Principles"])

        # 4. Databases & Data Storage
        self._add_skill("PostgreSQL", ["postgres", "psql", "postgresql rdbms"], "Databases & Storage",
                        "Advanced open-source relational database management system supporting ACID compliance, complex queries, and JSON.",
                        ["SQL", "Relational Database Design", "Database Indexing"])
        self._add_skill("MongoDB", ["mongo", "mongodb nosql"], "Databases & Storage",
                        "Document-oriented NoSQL database program using JSON-like documents with dynamic schemas for high scalability.",
                        ["NoSQL Concepts", "Data Modeling"])
        self._add_skill("Redis", ["redis cache", "in-memory datastore"], "Databases & Storage",
                        "In-memory key-value data structure store used as a distributed cache, message broker, and real-time database.",
                        ["Caching Strategies", "Distributed Systems Basics"])
        self._add_skill("Apache Kafka", ["kafka", "event streaming"], "Databases & Storage",
                        "Distributed event store and stream-processing platform for high-throughput, fault-tolerant real-time data feeds.",
                        ["Distributed Systems Basics", "Message Queuing", "Asynchronous Processing"])
        self._add_skill("SQL", ["structured query language", "relational sql"], "Databases & Storage",
                        "Domain-specific declarative query language for managing and querying data held in relational database systems.",
                        ["Relational Database Design"])

        # 5. Artificial Intelligence & Data Science
        self._add_skill("Machine Learning", ["ml", "applied ml", "predictive modeling"], "AI & Data Science",
                        "Discipline of artificial intelligence focusing on algorithms capable of learning patterns and generalizing from empirical data.",
                        ["Linear Algebra", "Probability & Statistics", "Python"])
        self._add_skill("Deep Learning", ["dl", "neural networks", "deep neural nets"], "AI & Data Science",
                        "Subfield of machine learning utilizing multi-layered artificial neural networks for high-dimensional feature extraction.",
                        ["Machine Learning", "Linear Algebra", "Vector Calculus", "GPU Computing"])
        self._add_skill("PyTorch", ["torch", "pytorch dl"], "AI & Data Science",
                        "Open-source machine learning library based on Torch for tensor computation and deep neural networks with dynamic autograd.",
                        ["Python", "Deep Learning", "Linear Algebra"])
        self._add_skill("Transformers", ["huggingface", "bert models", "llm", "large language models"], "AI & Data Science",
                        "Deep learning architecture utilizing multi-head self-attention mechanisms for natural language processing and computer vision.",
                        ["Deep Learning", "Natural Language Processing", "PyTorch"])
        self._add_skill("Natural Language Processing", ["nlp", "text mining", "computational linguistics"], "AI & Data Science",
                        "Computational techniques enabling algorithms to parse, understand, interpret, and generate human languages.",
                        ["Machine Learning", "Python", "Linguistics Basics"])
        self._add_skill("Scikit-Learn", ["sklearn"], "AI & Data Science",
                        "Robust Python module for classical machine learning, statistical modeling, clustering, and dimensional reduction.",
                        ["Python", "Machine Learning", "NumPy & Pandas"])
        self._add_skill("MLflow", ["mlops mlflow", "experiment tracking"], "AI & Data Science",
                        "Open-source platform managing end-to-end machine learning lifecycle including tracking, model packaging, and registry.",
                        ["Machine Learning", "DevOps Principles", "Docker"])

        # 6. Software Architecture & Distributed Systems
        self._add_skill("Microservices Architecture", ["microservices", "service-oriented architecture", "soa"], "Software Architecture",
                        "Architectural style structuring an application as a collection of loosely coupled, independently deployable services.",
                        ["RESTful API Design", "Distributed Systems Basics", "Docker", "Container Networking"])
        self._add_skill("RESTful API Design", ["rest", "restful apis", "rest api", "api design"], "Software Architecture",
                        "Architectural constraints for stateless client-server web services communicating over standard HTTP protocols.",
                        ["HTTP Protocol Basics", "Web Development Basics"])
        self._add_skill("GraphQL", ["graphql api"], "Software Architecture",
                        "Open-source data query and manipulation language for APIs providing clients complete control over requested data.",
                        ["RESTful API Design", "Web Development Basics"])
        self._add_skill("Distributed Systems", ["distributed computing", "distributed consensus"], "Software Architecture",
                        "Computing paradigm where networked components communicate and coordinate actions by passing messages to appear unified.",
                        ["Networking Fundamentals", "Concurrency Patterns", "Fault Tolerance"])
        self._add_skill("Git Version Control", ["git", "github", "gitlab", "version control"], "Software Architecture",
                        "Distributed version control system tracking source code modifications during collaborative software engineering.",
                        ["Software Engineering Best Practices"])

        # 7. Cybersecurity & Networking
        self._add_skill("Penetration Testing", ["pen testing", "ethical hacking"], "Cybersecurity & Networking",
                        "Authorized simulated cyberattack on computer systems to evaluate security posture and identify exploitable vulnerabilities.",
                        ["Network Security", "Linux Administration", "Vulnerability Assessment"])
        self._add_skill("Network Security", ["network protocols", "firewalls", "tcp/ip"], "Cybersecurity & Networking",
                        "Policies and practices adopted to prevent and monitor unauthorized access, misuse, or modification of computer networks.",
                        ["Networking Fundamentals", "Operating System Basics"])
        self._add_skill("Wireshark", ["packet capture", "packet analysis"], "Cybersecurity & Networking",
                        "Network protocol analyzer capturing and interactively browsing packet traffic flowing across computer networks.",
                        ["Networking Fundamentals", "TCP/IP Protocol Suite"])
        self._add_skill("SIEM", ["security information and event management", "splunk", "elastic siem"], "Cybersecurity & Networking",
                        "Software solution aggregating and analyzing security log data from enterprise systems to uncover real-time threats.",
                        ["Network Security", "Log Analysis", "Linux Administration"])

        # Foundational / Latent concepts
        foundations = [
            ("Object-Oriented Programming", "Programming Foundations"),
            ("Algorithmic Thinking", "Computer Science Theory"),
            ("Web Development Basics", "Web Architecture"),
            ("Asynchronous Programming", "Concurrency Patterns"),
            ("Relational Database Design", "Database Theory"),
            ("Operating System Basics", "Systems Engineering"),
            ("Networking Fundamentals", "Networking Theory"),
            ("Cloud Computing Concepts", "Cloud Infrastructure"),
            ("DevOps Principles", "Engineering Culture"),
            ("Infrastructure as Code", "Cloud Architecture"),
            ("Container Networking", "Networking Infrastructure"),
            ("Observability Principles", "Systems Reliability"),
            ("NoSQL Concepts", "Distributed Data"),
            ("Caching Strategies", "Systems Performance"),
            ("Distributed Systems Basics", "Distributed Architecture"),
            ("Message Queuing", "Enterprise Messaging"),
            ("Linear Algebra", "Mathematical Foundations"),
            ("Probability & Statistics", "Mathematical Foundations"),
            ("Vector Calculus", "Mathematical Foundations"),
            ("GPU Computing", "High Performance Computing"),
            ("NumPy & Pandas", "Data Manipulation"),
            ("Software Engineering Best Practices", "Software Engineering"),
            ("Vulnerability Assessment", "Cybersecurity Practice"),
            ("TCP/IP Protocol Suite", "Networking Theory"),
            ("Log Analysis", "Systems Telemetry"),
            ("Memory Management Basics", "Systems Engineering"),
            ("Systems Programming Basics", "Systems Engineering"),
            ("Concurrency Patterns", "Systems Engineering"),
            ("Data Modeling", "Database Theory"),
            ("Database Indexing", "Database Theory"),
            ("Automated Testing", "Software Engineering"),
            ("HTTP Protocol Basics", "Web Architecture"),
            ("Fault Tolerance", "Systems Reliability"),
            ("Linguistics Basics", "AI Foundations"),
            ("Asynchronous Processing", "Concurrency Patterns"),
            ("C", "Programming Foundations"),
        ]
        for name, cat in foundations:
            if name.lower() not in self.skills:
                self._add_skill(name, [], cat, f"Foundational competency in {name.lower()}.", [])

    def canonicalize(self, skill_name: str) -> Optional[str]:
        """Normalizes skill aliases to canonical ESCO preferred label."""
        cleaned = skill_name.strip().lower()
        if cleaned in self.alias_to_canonical:
            return self.alias_to_canonical[cleaned]
        stripped = re.sub(r'[^a-zA-Z0-9\s]', '', cleaned)
        if stripped in self.alias_to_canonical:
            return self.alias_to_canonical[stripped]
        return None

    def get_skill(self, name: str) -> Optional[ESCOSkill]:
        canonical = self.canonicalize(name)
        if canonical:
            return self.skills.get(canonical.lower())
        return None

    def get_implicit_prerequisites(self, skill_names: List[str]) -> List[str]:
        """Traverses the dependency graph to retrieve latent prerequisite competencies."""
        prereqs = set()
        for s in skill_names:
            skill_obj = self.get_skill(s)
            if skill_obj and skill_obj.implicit_prerequisites:
                for p in skill_obj.implicit_prerequisites:
                    prereqs.add(p)
                    p_obj = self.get_skill(p)
                    if p_obj and p_obj.implicit_prerequisites:
                        for sub_p in p_obj.implicit_prerequisites:
                            prereqs.add(sub_p)
        return sorted(list(prereqs))

    def category_affinity(self, skill_a: str, skill_b: str) -> float:
        """Computes categorical hierarchy proximity bonus."""
        obj_a = self.get_skill(skill_a)
        obj_b = self.get_skill(skill_b)
        if obj_a and obj_b and obj_a.category == obj_b.category:
            return 1.0
        return 0.0

    def get_all_skills(self) -> List[str]:
        """Returns all canonical skill names."""
        return [s.preferred_label for s in self.skills.values()]

    def get_skill_categories(self) -> Dict[str, List[str]]:
        """Returns skills grouped by category."""
        categories: Dict[str, List[str]] = {}
        for skill in self.skills.values():
            if skill.category not in categories:
                categories[skill.category] = []
            categories[skill.category].append(skill.preferred_label)
        return categories


# Singleton instance
esco_engine = ESCOTaxonomyEngine()
