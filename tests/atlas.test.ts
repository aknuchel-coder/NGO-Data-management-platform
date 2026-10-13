import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import {
  rotationFromProgress,
  scrollProgress,
  visibleOnGlobe,
  powerBiEmbedUrl,
} from "../src/lib/atlas.ts";
import { projects, projectBySlug } from "../src/data/projects.ts";

test("scroll maps to exactly one turn and clamps outside the pinned span", () => {
  assert.equal(rotationFromProgress(scrollProgress(0, 2400, 800)), 0);
  assert.equal(rotationFromProgress(scrollProgress(-800, 2400, 800)), 180);
  assert.equal(rotationFromProgress(scrollProgress(-1600, 2400, 800)), 360);
  assert.equal(rotationFromProgress(scrollProgress(-2400, 2400, 800)), 360);
  assert.equal(rotationFromProgress(-1), 0);
  assert.equal(scrollProgress(100, 800, 800), 0);
});

test("points hide on the far side and return after one complete turn", () => {
  assert.equal(visibleOnGlobe(20, 0, 20), true);
  assert.equal(visibleOnGlobe(-160, 0, 20), false);
  for (const project of projects)
    assert.equal(
      visibleOnGlobe(...project.coordinates, 20),
      visibleOnGlobe(...project.coordinates, 380),
    );
});

test("Power BI accepts only report embed URLs on the exact HTTPS host", () => {
  assert.equal(
    powerBiEmbedUrl("https://app.powerbi.com/reportEmbed?reportId=example"),
    "https://app.powerbi.com/reportEmbed?reportId=example",
  );
  assert.equal(
    powerBiEmbedUrl("https://app.powerbi.com/view?r=example"),
    "https://app.powerbi.com/view?r=example",
  );
  for (const url of [
    "",
    "not a URL",
    "javascript:alert(1)",
    "http://app.powerbi.com/view?r=x",
    "https://app.powerbi.com.evil.example/view?r=x",
    "https://app.powerbi.com/home",
    "https://app.powerbi.com/view",
    "https://user:password@app.powerbi.com/view?r=x",
  ])
    assert.equal(powerBiEmbedUrl(url), null);
});

test("every project has a unique route, local images and report content", () => {
  assert.equal(
    new Set(projects.map((project) => project.slug)).size,
    projects.length,
  );
  for (const project of projects) {
    assert.equal(projectBySlug(project.slug), project);
    assert.ok(project.sections.length >= 2);
    assert.ok(project.challenge && project.response);
    assert.ok(existsSync(`public${project.image}`));
    for (const image of project.gallery)
      assert.ok(existsSync(`public${image.src}`));
    if (project.status !== "notable") assert.equal(project.sample, true);
    if (!project.sample) assert.ok(project.sources.length > 0);
  }
  assert.equal(projectBySlug("unknown"), undefined);
  assert.ok(existsSync("public/data/land-110m.json"));
});
