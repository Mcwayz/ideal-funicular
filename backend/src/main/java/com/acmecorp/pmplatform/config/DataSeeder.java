package com.acmecorp.pmplatform.config;

import com.acmecorp.pmplatform.entity.*;
import com.acmecorp.pmplatform.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (organizationRepository.count() > 0) {
            return; // Data already exists
        }

        // 1. Create Organization
        Organization acme = new Organization();
        acme.setName("Acme Corp");
        acme.setDomain("acmecorp.com");
        acme = organizationRepository.save(acme);

        // 2. Create Roles
        Role adminRole = new Role();
        adminRole.setName("Administrator");
        adminRole.setOrganization(acme);
        adminRole.setSystemDefault(true);
        adminRole = roleRepository.save(adminRole);

        Role pmRole = new Role();
        pmRole.setName("Project Manager");
        pmRole.setOrganization(acme);
        pmRole = roleRepository.save(pmRole);

        // 3. Create Users
        User admin = new User();
        admin.setEmail("admin@acmecorp.com");
        admin.setFirstName("Felix");
        admin.setLastName("Administrator");
        admin.setPasswordHash(passwordEncoder.encode("admin123"));
        admin.setOrganization(acme);
        admin.setRoles(Set.of(adminRole));
        userRepository.save(admin);

        User pm = new User();
        pm.setEmail("sarah@acmecorp.com");
        pm.setFirstName("Sarah");
        pm.setLastName("Wilson");
        pm.setPasswordHash(passwordEncoder.encode("password123"));
        pm.setOrganization(acme);
        pm.setRoles(Set.of(pmRole));
        userRepository.save(pm);

        // 4. Create Projects
        Project residentialTower = new Project();
        residentialTower.setName("Skyline Residential Tower");
        residentialTower.setDescription("45-story high-rise construction in downtown metropolitan area.");
        residentialTower.setOrganization(acme);
        residentialTower.setStatus("IN_PROGRESS");
        residentialTower.setType("CONSTRUCTION");
        residentialTower.setStartDate(LocalDate.now().minusMonths(2));
        residentialTower.setEndDate(LocalDate.now().plusMonths(12));
        residentialTower.setBudget(new BigDecimal("125000000.00"));
        residentialTower.setOwner(pm);
        residentialTower = projectRepository.save(residentialTower);

        Project erpMigration = new Project();
        erpMigration.setName("Quantum ERP Migration");
        erpMigration.setDescription("Enterprise-wide migration to cloud-based ERP infrastructure.");
        erpMigration.setOrganization(acme);
        erpMigration.setStatus("PLANNING");
        erpMigration.setType("SOFTWARE");
        erpMigration.setStartDate(LocalDate.now().plusWeeks(2));
        erpMigration.setEndDate(LocalDate.now().plusMonths(6));
        erpMigration.setBudget(new BigDecimal("2500000.00"));
        erpMigration.setOwner(pm);
        erpMigration = projectRepository.save(erpMigration);

        // 5. Create Tasks for Residential Tower
        Task foundation = new Task();
        foundation.setProject(residentialTower);
        foundation.setTitle("Foundation & Excavation");
        foundation.setStatus("DONE");
        foundation.setPriority("CRITICAL");
        foundation.setStartDate(LocalDateTime.now().minusMonths(2));
        foundation.setDueDate(LocalDateTime.now().minusMonths(1));
        taskRepository.save(foundation);

        Task structure = new Task();
        structure.setProject(residentialTower);
        structure.setTitle("Core Structure Framing");
        structure.setStatus("IN_PROGRESS");
        structure.setPriority("HIGH");
        structure.setStartDate(LocalDateTime.now().minusMonths(1));
        structure.setDueDate(LocalDateTime.now().plusMonths(3));
        taskRepository.save(structure);

        Task plumbing = new Task();
        plumbing.setProject(residentialTower);
        plumbing.setTitle("Mechanical & Plumbing Rough-in");
        plumbing.setStatus("TODO");
        plumbing.setPriority("MEDIUM");
        plumbing.setDueDate(LocalDateTime.now().plusMonths(4));
        taskRepository.save(plumbing);
    }
}
